from flask import Blueprint

routes = Blueprint("routes", __name__)

from website.routes import general
