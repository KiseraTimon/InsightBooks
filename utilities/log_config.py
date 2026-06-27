# utilities/log_config.py

import logging
import os
from logging import FileHandler, StreamHandler
from flask import request, has_request_context

class RequestContextFormatter(logging.Formatter):
    def format(self, record):
        if has_request_context():
            record.url = getattr(request, "url", None)
        else:
            record.url = None
        return super().format(record)

# Formats
file_format = RequestContextFormatter(
    "**********\nSOURCE: %(url)s\nTIME: %(asctime)s\nTYPE: %(levelname)s\nMESSAGE:\n%(message)s\n",
    datefmt="%Y-%m-%d %H:%M:%S",
)
console_format = RequestContextFormatter(
    "[%(asctime)s] || %(levelname)s || %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

# Shared Console Handler
console_handler = StreamHandler()
console_handler.setFormatter(console_format)

def get_sys_logger():
    logger = logging.getLogger("system_logger")
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        logger.addHandler(console_handler)
    return logger

def get_error_logger():
    logger = logging.getLogger("error_logger")
    if not logger.handlers:
        logger.setLevel(logging.ERROR)
        logger.addHandler(console_handler)
    return logger

def write_to_file(folder: str, filename: str, message: str, is_error: bool = False):
    """Safely appends to a log file without churning root handlers."""
    os.makedirs(folder, exist_ok=True)
    file_path = os.path.join(folder, f"{filename}.log")


    with open(file_path, "a", encoding="utf-8") as f:
        f.write(message + "\n")