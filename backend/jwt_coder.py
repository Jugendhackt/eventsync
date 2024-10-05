import jwt
from jwt.exceptions import ExpiredSignatureError


data = {"pw": "1234"}
SECRET = "super_secure"


def jwt_encode(_data, _secret):
    tokentemp = jwt.encode(payload=_data, key=_secret)
    return tokentemp


TOKEN = jwt_encode(data, SECRET)


def jwt_decode(token):
    try:
        decoded = jwt.decode(token, key='super_secure', algorithms=['HS256', ])
    except ExpiredSignatureError as error:
        print(f'Unable to decode the token, error: {error}')
        raise
    return decoded


decoded = jwt_decode(TOKEN)
