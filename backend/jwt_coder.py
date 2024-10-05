import jwt
from jwt.exceptions import ExpiredSignatureError, DecodeError


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
