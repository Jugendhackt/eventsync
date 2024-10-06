from yaml import safe_load


with open("config.yaml", "rt", encoding="utf-8") as f:
    config = safe_load(f)
