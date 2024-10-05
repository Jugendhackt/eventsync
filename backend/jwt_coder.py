import jwt
from jwt.exceptions import ExpiredSignatureError


data = { "pw": "1234" }
SECRET = 'super_secure'

def jwt_encode(_data, _secret):
    tokentemp = jwt.encode(payload=_data, key=_secret)
    return tokentemp

TOKEN = jwt_encode(data, SECRET)
print(TOKEN)

def jwt_decode(_token, key):
    try:
        _decoded = jwt.decode(_token, key=key, algorithms=['HS256', ])
    except ExpiredSignatureError as error:
        print(f'Unable to decode the token, error: {error}')
    return _decoded

decoded = jwt_decode(TOKEN, SECRET)
print(decoded)
