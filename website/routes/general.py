from website.routes import routes
from flask import render_template

# Homepage
@routes.route("/")
def homepage():
    return render_template("home/index.html")