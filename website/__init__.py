# website/__init__.py

from __future__ import annotations
from flask import Flask

# Config Files
from config import Default, Development, Production

# Utility Files
from utilities import log_system_info, log_critical_error

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

    config_keys = ["DEBUG", "TESTING"]
    config_summary = "\n".join(f"{key}: {app.config.get(key)}" for key in config_keys)

    if os.getenv("WERKZEUG_RUN_MAIN") == "true" or not app.debug:
        startup_msg = f"Application Server Start Attempted\n-----\nApp Settings:\n{config_summary}\nFLASK MODE: {mode.upper()}"
        log_system_info(startup_msg, log="server_boot", path="lifecycle")

    # Routes
    from website.routes import routes
    app.register_blueprint(routes, url_prefix="/")

    # Global Web Exception Handler
    @app.errorhandler(Exception)
    def handle_unhandled_exception(e):
        # Logging full stack trace
        log_critical_error(e, log="unhandled_web_crashes", path="web")

        # Re-raising error in dev-mode so the interactive Werkzeug debugger shows up
        if app.debug:
            raise e

        # Friendly error page in prod mode
        return "An internal server error occurred.", 500

    return app