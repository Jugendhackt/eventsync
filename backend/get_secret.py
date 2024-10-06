from os import environ

from config import config


if config["secret_via_environment_var"]:
    SECRET_KEY = environ["SECRET_KEY"]
else:
    with open(config["secret_path"], "rt", encoding="utf-8") as f:
        SECRET_KEY = f.read()
