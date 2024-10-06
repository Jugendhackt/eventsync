from hashlib import sha256
from get_secret import SECRET_KEY


PEPPER = SECRET_KEY


def to_hash(raw: str, salt: str) -> str:
    return sha256((PEPPER + salt + raw + salt + PEPPER).encode()).hexdigest()
