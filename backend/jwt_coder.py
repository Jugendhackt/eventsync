import jwt
from jwt.exceptions import ExpiredSignatureError, DecodeError


with open("secret_key", "rt", encoding="utf-8") as f:
    SECRET_KEY = f.read()


def jwt_encode(data, secret):
    """takes data and secret and returns the token"""
    return jwt.encode(payload=data, key=secret)


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


def check_token(request):
    token = request.headers.get("token")
    if token is None:
        return False
    return jwt_decode(token, SECRET_KEY) is not None


def check_token_admin(request):
    token = request.headers.get("token")
    if token is None:
        return False
    result = jwt_decode(token, SECRET_KEY)
    if result is None:
        return False
    return result.get("is_admin")
