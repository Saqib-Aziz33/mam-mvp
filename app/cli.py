"""CLI interface for the marketing system."""

import argparse
import sys
import json
from pathlib import Path
from datetime import datetime
from uuid import uuid4
from app.models.schemas import MarketingBrief
from app.graph.workflow import create_workflow
from app.utils.logging import setup_logger
from app.utils.io import create_run_directory


def load_brief_from_file(filepath: str) -> dict:
    """Load brief from a file (JSON or markdown)."""
    path = Path(filepath)
    
    if not path.exists():
        raise FileNotFoundError(f"Brief file not found: {filepath}")
    
    if path.suffix == '.json':
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    elif path.suffix in ['.md', '.txt']:
        # Parse markdown brief (simple key: value format)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        brief_data = {}
        for line in content.split('\n'):
            if ':' in line and not line.startswith('#'):
                key, value = line.split(':', 1)
                key = key.strip().lower().replace(' ', '_')
                value = value.strip()
                if value:
                    brief_data[key] = value
        
        return brief_data
    
    else:
        raise ValueError(f"Unsupported file format: {path.suffix}")


def parse_brief_from_string(brief_str: str) -> dict:
    """Parse brief from command line string."""
    # Simple format: "topic: X, goal: Y, audience: Z"
    brief_data = {}
    
    # Try to parse as JSON first
    try:
        brief_data = json.loads(brief_str)
        return brief_data
    except json.JSONDecodeError:
        pass
    
    # Parse as simple text
    # Assume format: "Build a marketing campaign for Fastbase's new AI feature"
    # We'll use this as the topic
    brief_data['topic'] = brief_str
    
    # Prompt for required fields
    print("\nPlease provide additional information:")
    
    if 'campaign_goal' not in brief_data:
        goal = input("Campaign Goal: ").strip()
        if goal:
            brief_data['campaign_goal'] = goal
    
    if 'target_audience' not in brief_data:
        audience = input("Target Audience (press Enter for default): ").strip()
        if audience:
            brief_data['target_audience'] = audience
    
    if 'brand_voice' not in brief_data:
        voice = input("Brand Voice (press Enter for default): ").strip()
        if voice:
            brief_data['brand_voice'] = voice
    
    return brief_data


def run_workflow(brief_data: dict) -> str:
    """
    Execute the marketing workflow.
    
    Returns:
        run_id
    """
    # Generate run ID
    run_id = f"run_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{str(uuid4())[:8]}"
    
    # Setup logger
    logger = setup_logger(run_id)
    
    # Create run directory
    create_run_directory(run_id)
    
    logger.info(f"Starting marketing workflow - Run ID: {run_id}")
    logger.info(f"Topic: {brief_data.get('topic', 'N/A')}")
    
    print("\n" + "="*60)
    print(f"MARKETING WORKFLOW STARTED")
    print("="*60)
    print(f"Run ID: {run_id}")
    print(f"Topic: {brief_data.get('topic', 'N/A')}")
    print("="*60 + "\n")
    
    try:
        # Create brief model
        brief = MarketingBrief(**brief_data)
        
        # Initialize state with manual approval for CLI
        initial_state = {
            "run_id": run_id,
            "brief": brief,
            "research_report": None,
            "blog_draft": None,
            "seo_optimized_blog": None,
            "social_assets": None,
            "email_assets": None,
            "approvals": {},
            "errors": [],
            "status": "initialized",
            "artifacts_path": None,
            "retry_count": 0,
            "auto_approve": False  # Manual approval in CLI mode
        }
        
        # Create and run workflow
        workflow = create_workflow()
        
        logger.info("Executing workflow...")
        final_state = workflow.invoke(initial_state)
        
        # Check final status
        if final_state['status'] == 'completed':
            logger.info("Workflow completed successfully")
            print("\n✓ Workflow completed successfully!")
            return run_id
        
        elif final_state['status'] == 'rejected':
            logger.warning("Content rejected by user")
            print("\n✗ Content rejected. No artifacts saved.")
            return run_id
        
        else:
            logger.error(f"Workflow failed with status: {final_state['status']}")
            if final_state.get('errors'):
                print("\n✗ Workflow failed with errors:")
                for error in final_state['errors']:
                    print(f"  - {error}")
            return run_id
    
    except Exception as e:
        logger.error(f"Workflow execution error: {str(e)}")
        print(f"\n✗ Error: {str(e)}")
        raise


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Multi-agent marketing system for Fastbase",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python -m app run --brief "Launch campaign for Fastbase AI assistant"
  python -m app run --brief-file brief.json
  python -m app run --brief-file brief.md
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Commands')
    
    # Run command
    run_parser = subparsers.add_parser('run', help='Run the marketing workflow')
    run_parser.add_argument(
        '--brief',
        type=str,
        help='Marketing brief as a string'
    )
    run_parser.add_argument(
        '--brief-file',
        type=str,
        help='Path to brief file (JSON or Markdown)'
    )
    
    args = parser.parse_args()
    
    if args.command == 'run':
        # Load brief
        if args.brief_file:
            try:
                brief_data = load_brief_from_file(args.brief_file)
            except Exception as e:
                print(f"Error loading brief file: {e}")
                sys.exit(1)
        
        elif args.brief:
            try:
                brief_data = parse_brief_from_string(args.brief)
            except Exception as e:
                print(f"Error parsing brief: {e}")
                sys.exit(1)
        
        else:
            print("Error: Either --brief or --brief-file is required")
            run_parser.print_help()
            sys.exit(1)
        
        # Run workflow
        try:
            run_id = run_workflow(brief_data)
            print(f"\nRun ID: {run_id}")
            print(f"Artifacts: runs/{run_id}/")
        except Exception as e:
            print(f"\nFatal error: {e}")
            sys.exit(1)
    
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
