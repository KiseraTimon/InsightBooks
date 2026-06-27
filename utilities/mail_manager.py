# utilities/mail_manager.py

import os
import smtplib
from email.message import EmailMessage
from flask import current_app
from .error_handler import log_critical_error
from .sys_logger import log_system_info

def send_email(recipient: str, subject: str, body: str = None, html: str = None, sender: str = None) -> bool:
    if not recipient or not subject:
        return False

    # Gracefully fetches config from Flask app context, or fallback to OS environment
    cfg = current_app.config if current_app else {}

    mail_host = cfg.get("MAIL_SERVER") or os.getenv("MAIL_SERVER", "localhost")
    mail_port = int(cfg.get("MAIL_PORT") or os.getenv("MAIL_PORT", 25))
    mail_user = cfg.get("MAIL_USERNAME") or os.getenv("MAIL_USERNAME")
    mail_pass = cfg.get("MAIL_PASSWORD") or os.getenv("MAIL_PASSWORD")
    use_tls = cfg.get("MAIL_USE_TLS", False)
    use_ssl = cfg.get("MAIL_USE_SSL", False)

    from_addr = sender or cfg.get("MAIL_DEFAULT_SENDER") or os.getenv("MAIL_DEFAULT_SENDER")

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = from_addr
    msg["To"] = recipient

    if html and body:
        msg.set_content(body)
        msg.add_alternative(html, subtype="html")
    elif html:
        msg.add_alternative(html, subtype="html")
    else:
        msg.set_content(body or "")

    try:
        smtp_class = smtplib.SMTP_SSL if use_ssl else smtplib.SMTP
        with smtp_class(mail_host, mail_port) as smtp:
            if not use_ssl:
                smtp.ehlo()
                if use_tls:
                    smtp.starttls()
                    smtp.ehlo()
            if mail_user and mail_pass:
                smtp.login(mail_user, mail_pass)
            smtp.send_message(msg)

        log_system_info(f"Dispatched email to '{recipient}'", log="mailer", path="utils")
        return True

    except Exception as e:
        log_critical_error(e, log="mailer_failures", path="utils")
        return False