import jwt
from jwt.exceptions import ExpiredSignatureError


data = {
    "pw": "1234",
}
secret = 'super_secure'

def JWT_encode(data, secret):

    tokentemp = jwt.encode(
        payload=data,
        key=secret
    )
    return(tokentemp)


    

token = JWT_encode(data, secret)
print (token)

def JWT_decode(token, secret):
    try:
        decoded = jwt.decode(token, key='super_secure', algorithms=['HS256', ])

    except ExpiredSignatureError as error:
        print(f'Unable to decode the token, error: {error}')
    return(decoded)
        
decoded = JWT_decode(token, secret)
print (decoded)