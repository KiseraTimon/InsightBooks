from website.routes import routes
from flask import render_template, request, redirect, url_for, flash

# Homepage
@routes.route("/")
def homepage():
    return render_template("home/index.html")


# About
@routes.route("/about")
def about():
    return render_template("about/index.html")


# Contact
@routes.route("/contact", methods=['GET', 'POST'])
def contact():
    # POST Requests
    if request.method == "POST":
        name = request.form.get("name", None)
        email = request.form.get("email", None)
        subject = request.form.get("subject", None)
        message = request.form.get("message", None)

        if not all([name, email, subject, message]):
            flash("Kindly fill in all required fields", category="warning")
            return redirect(request.url)

        flash("Your message has been received. Our team will reach you shortly", category="success")

        # Todo: Data Storage Logic
        print("Name: ", name)
        print("Email: ", email)
        print("Subject: ", subject)
        print("Message: ", message)

        return redirect(url_for('routes.contact'))

    return render_template("contact/index.html")