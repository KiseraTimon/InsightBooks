from flask import Flask


# App Factory
def create_app() -> Flask:

    app = Flask(__name__)

    return app