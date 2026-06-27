# website/__init__.py

from __future__ import annotations
from flask import Flask

# Config Files
from config import Default, Development, Production

# Other Packages
from dotenv import load_dotenv
import os

# Configurations Map
CONFIG_MAP = {
    "production": Production,
    "development": Development,
}

# App Factory
def create_app() -> Flask:
    # Loading Environment Variables
    load_dotenv()

    # Flask Access Mode
    mode = str(os.getenv("FLASK_MODE", "")
    ).strip().lower()

    # Flask Object
    app = Flask(__name__)

    # Production Configuration
    app.config.from_object(CONFIG_MAP.get(mode, Default))


    try:
        # Critical Config Keys Summary
        config_keys = ["DEBUG", "TESTING"]
        config_summary = "\n".join(
            f"{key}: {app.config.get(key)}" for key in config_keys
        )

        # Prevent double-logging from Werkzeug's reloader process
        if os.getenv("WERKZEUG_RUN_MAIN") == "true" or not app.debug:
            print("\n\n*****")
            app.logger.info(
                f"\n\n*****\nApplication Server Start Attempted\n-----\nApp Settings:\n{config_summary}\nFLASK MODE: {mode.capitalize()}\n*****\n\n"
            )

        return app

    except Exception as e:
        print("An error occurred starting the Flask server")