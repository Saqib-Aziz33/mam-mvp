"""Configuration management for the marketing system."""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Project paths
PROJECT_ROOT = Path(__file__).parent.parent
RUNS_DIR = PROJECT_ROOT / "runs"
PROMPTS_DIR = PROJECT_ROOT / "app" / "prompts"

# Ensure runs directory exists
RUNS_DIR.mkdir(exist_ok=True)

# OpenAI Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

# Model Configuration
# DEFAULT_MODEL = "gpt-4o-mini"
DEFAULT_MODEL = "gpt-5.4-mini"
TEMPERATURE = 0.7
MAX_TOKENS = 4000

# Workflow Configuration
MAX_RETRIES = 1
ENABLE_HUMAN_APPROVAL = True

# Brand Configuration (can be overridden by brief)
DEFAULT_BRAND_VOICE = "professional, engaging, and informative"
DEFAULT_TARGET_AUDIENCE = "B2B decision makers and technical professionals"
