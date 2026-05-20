"""WebSocket endpoints for real-time updates."""

import json
from typing import Dict, Set
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from datetime import datetime

from app.config import RUNS_DIR


router = APIRouter()


# Store active WebSocket connections
class ConnectionManager:
    """Manages WebSocket connections for real-time updates."""
    
    def __init__(self):
        # Dictionary of run_id -> set of websockets
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        # Global connections (receive all updates)
        self.global_connections: Set[WebSocket] = {}
    
    async def connect(self, websocket: WebSocket, run_id: str = None):
        """Connect a WebSocket client."""
        await websocket.accept()
        
        if run_id:
            if run_id not in self.active_connections:
                self.active_connections[run_id] = set()
            self.active_connections[run_id].add(websocket)
        else:
            self.global_connections.add(websocket)
    
    def disconnect(self, websocket: WebSocket, run_id: str = None):
        """Disconnect a WebSocket client."""
        if run_id and run_id in self.active_connections:
            self.active_connections[run_id].discard(websocket)
            if not self.active_connections[run_id]:
                del self.active_connections[run_id]
        
        self.global_connections.discard(websocket)
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send a message to a specific client."""
        try:
            await websocket.send_json(message)
        except:
            pass
    
    async def broadcast_to_run(self, run_id: str, message: dict):
        """Broadcast a message to all clients watching a specific run."""
        if run_id in self.active_connections:
            disconnected = set()
            for connection in self.active_connections[run_id]:
                try:
                    await connection.send_json(message)
                except:
                    disconnected.add(connection)
            
            # Clean up disconnected clients
            for conn in disconnected:
                self.active_connections[run_id].discard(conn)
    
    async def broadcast_global(self, message: dict):
        """Broadcast a message to all connected clients."""
        disconnected = set()
        for connection in self.global_connections:
            try:
                await connection.send_json(message)
            except:
                disconnected.add(connection)
        
        # Clean up disconnected clients
        for conn in disconnected:
            self.global_connections.discard(conn)


# Global connection manager
manager = ConnectionManager()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    General WebSocket endpoint for receiving all workflow updates.
    
    Connect without specifying a run_id to receive all updates.
    """
    await manager.connect(websocket)
    
    try:
        while True:
            # Wait for messages (ping/pong keep-alive)
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle client messages (e.g., subscribe to specific run)
            if message.get("type") == "subscribe":
                run_id = message.get("run_id")
                if run_id:
                    await manager.connect(websocket, run_id)
            
            elif message.get("type") == "unsubscribe":
                run_id = message.get("run_id")
                if run_id:
                    manager.disconnect(websocket, run_id)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)


@router.websocket("/ws/{run_id}")
async def websocket_run_endpoint(websocket: WebSocket, run_id: str):
    """
    WebSocket endpoint for a specific run's updates.
    
    Connect to receive updates for a specific workflow run.
    """
    await manager.connect(websocket, run_id)
    
    try:
        while True:
            # Wait for messages (could be used for commands)
            data = await websocket.receive_text()
            
            # Handle any commands from client
            try:
                message = json.loads(data)
                # Process commands if needed
            except:
                pass
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, run_id)
    except Exception:
        manager.disconnect(websocket, run_id)


async def notify_workflow_update(run_id: str, step: str, status: str, message: str = None):
    """
    Send a workflow update to connected clients.
    
    This function should be called from the workflow to send updates.
    """
    update = {
        "type": "workflow_update",
        "run_id": run_id,
        "step": step,
        "status": status,
        "message": message,
        "timestamp": datetime.now().isoformat()
    }
    
    await manager.broadcast_to_run(run_id, update)
    await manager.broadcast_global(update)


async def notify_workflow_complete(run_id: str, success: bool, errors: list = None):
    """
    Send a workflow completion notification.
    """
    notification = {
        "type": "workflow_complete",
        "run_id": run_id,
        "success": success,
        "errors": errors or [],
        "timestamp": datetime.now().isoformat()
    }
    
    await manager.broadcast_to_run(run_id, notification)
    await manager.broadcast_global(notification)


async def notify_approval_required(run_id: str):
    """
    Notify clients that approval is required.
    """
    notification = {
        "type": "approval_required",
        "run_id": run_id,
        "message": "Content review and approval needed",
        "timestamp": datetime.now().isoformat()
    }
    
    await manager.broadcast_to_run(run_id, notification)
    await manager.broadcast_global(notification)