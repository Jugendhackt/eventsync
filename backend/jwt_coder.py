import jwt
from jwt.exceptions import ExpiredSignatureError


def jwt_encode(data, secret):
    """takes data and secret and returns the token"""
    return jwt.encode(payload=data, key=secret)


def jwt_decode(token, key):
    """takes token and returns decoded data"""
    try:
        decoded = jwt.decode(token, key=key, algorithms=['HS256', ])
    except ExpiredSignatureError as error:
        print(f'Unable to decode the token, error: {error}')
        raise
    return decoded
