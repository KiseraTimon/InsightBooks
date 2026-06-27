from website.routes import routes

# Homepage
@routes.route("/")
def homepage():
    return "Homepage is working"