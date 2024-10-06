from os import environ
from yaml import safe_load

with open("config.yaml", "rt", encoding="utf-8") as f:
    config = safe_load(f)

if config["secret_via_environment_var"]:
    SECRET_KEY = environ["SECRET_KEY"]
else:
    with open(config["secret_path"], "rt", encoding="utf-8") as f:
        SECRET_KEY = f.read()
