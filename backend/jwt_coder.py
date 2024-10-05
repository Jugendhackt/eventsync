import jwt
from jwt.exceptions import ExpiredSignatureError, DecodeError

from fastapi import Request, HTTPException


with open("secret_key", "rt", encoding="utf-8") as f:
    SECRET_KEY = f.read()


def jwt_encode(data):
    """takes data and secret and returns the token"""
    return jwt.encode(payload=data, key=SECRET_KEY)


def jwt_decode(token, key):
    """takes token and returns decoded data"""
    try:
        decoded = jwt.decode(token, key=key, algorithms=['HS256', ])
        return decoded
    except ExpiredSignatureError as e:
        print(f'Expired, error: {e}')
    except DecodeError as e:
        print(f'Unable to decode the token, error: {e}')
    return None


def user_id_from_request(request):
    token = request.headers.get("token")
    if token is None:
        return False
    return jwt_decode(token, SECRET_KEY).get("user_id")


def check_token_admin(request):
    token = request.headers.get("token")
    if token is None:
        return False
    result = jwt_decode(token, SECRET_KEY)
    if result is None:
        return False
    return result.get("is_admin")


def check_token_admin_deco(func):
    """
    Decorated function must accept exactly two args:
    - request: Request
    - body: dict
    """
    def wrapper(request: Request, body: dict = None):
        token = request.headers.get("token")
        if token is None:
            raise HTTPException(status_code=401)
        result = jwt_decode(token, SECRET_KEY)
        if result is None:
            raise HTTPException(status_code=401)

        if result.get("is_admin"):
            return func(request, body)
    return wrapper
