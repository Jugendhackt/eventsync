"""
generate(encode), decode and verify contents of json-web-tokens (jwt)
"""
import jwt
from jwt.exceptions import ExpiredSignatureError, DecodeError

from fastapi import Request, HTTPException
from get_secret import SECRET_KEY


def jwt_encode(data: dict):
    """Takes data and returns the token"""
    return jwt.encode(payload=data, key=SECRET_KEY)


def jwt_decode(token, key):
    """Takes token and returns decoded data"""
    try:
        data = jwt.decode(token, key=key, algorithms=['HS256', ])
        return data
    except ExpiredSignatureError as e:
        print(f'Expired, error: {e}')
    except DecodeError as e:
        print(f'Unable to decode the token, error: {e}')
    return None


def get_user_id(request: Request):
    """Extracts the user_id from the request"""
    token = request.headers.get("token")
    if token is None:
        return False
    data = jwt_decode(token, SECRET_KEY)
    if data is None:
        return False
    return jwt_decode(token, SECRET_KEY).get("user_id")


def check_token_admin(request: Request) -> bool:
    """Checks if a user is admin from the request"""
    token = request.headers.get("token")
    if token is None:
        return False
    result = jwt_decode(token, SECRET_KEY)
    if result is None:
        return False
    return result.get("is_admin")


def check_token_admin_deco(func):
    """
    Checks if a user is admin from the request

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
