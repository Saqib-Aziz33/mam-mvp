"""Main entry point for the marketing system."""

import sys
from app.cli import main as cli_main
from app.api.main import start_server


def main():
    """Main entry point with CLI and server options."""
    if len(sys.argv) > 1 and sys.argv[1] == "serve":
        # Start API server
        start_server()
    else:
        # Run CLI
        cli_main()


if __name__ == '__main__':
    main()
