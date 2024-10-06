from hashlib import sha256


with open("../secret_key", "rt", encoding="utf-8") as f:
    SECRET_KEY = f.read()

PEPPER = SECRET_KEY


def to_hash(raw: str, salt: str) -> str:
    return sha256((PEPPER + salt + raw + salt + PEPPER).encode()).hexdigest()
