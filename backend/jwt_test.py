import jwt
from jwt.exceptions import ExpiredSignatureError
data = {
    "pw": "1234",
}

secret = 'super_secure'

token = jwt.encode(
    payload=data,
    key=secret
)

print(token)
try:
    decoded = jwt.decode(token, key='super_secure', algorithms=['HS256', ])

except ExpiredSignatureError as error:
    print(f'Unable to decode the token, error: {error}')
    
print(decoded)