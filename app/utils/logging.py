"""Logging utilities."""

import logging
from pathlib import Path
from datetime import datetime
from app.config import RUNS_DIR


def setup_logger(run_id: str) -> logging.Logger:
    """Set up logger for a run."""
    logger = logging.getLogger(f"marketing_system.{run_id}")
    logger.setLevel(logging.INFO)
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_format = logging.Formatter('%(levelname)s: %(message)s')
    console_handler.setFormatter(console_format)
    
    # File handler
    log_dir = RUNS_DIR / run_id
    log_dir.mkdir(parents=True, exist_ok=True)
    file_handler = logging.FileHandler(log_dir / 'run.log')
    file_handler.setLevel(logging.DEBUG)
    file_format = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    file_handler.setFormatter(file_format)
    
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
    
    return logger


def log_step(logger: logging.Logger, step_name: str, status: str = "started"):
    """Log a workflow step."""
    timestamp = datetime.now().strftime("%H:%M:%S")
    logger.info(f"[{timestamp}] {step_name} - {status}")
