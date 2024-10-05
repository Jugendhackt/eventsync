from uuid import uuid4
from json import loads as json_loads
from fastapi import FastAPI, Response, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import run as uvicorn_run

from sqlite_handler import SQLiteHandler
from event import Event
from jwt_coder import jwt_encode, jwt_decode
from hashing import hash_it


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


with open("secret_key", "rt", encoding="utf-8") as f:
    SECRET_KEY = f.read()


def check_token(request):
    token = request.headers.get("token")
    if token is None:
        return False
    return jwt_decode(token, SECRET_KEY)


@app.get("/events")
def get_events(search_filter):
    search_filter = json_loads(search_filter)
    command = "SELECT * FROM events WHERE verified=1"
    for key, item in enumerate(search_filter):
        if key == "tags":
            continue
        command += f" WHERE {key} = '{item}'"

    with SQLiteHandler() as cur:
        cur.execute(command)
        events = list(map(dict, cur.fetchall()))

        for event in events:
            cur.execute(
                "SELECT tag FROM event_tags WHERE event_id = ?",
                (event["event_id"],)
            )
            event["tags"] = ",".join(list(map(lambda x: x["tag"], cur.fetchall())))
        return events


@app.post("/events")
def create_event(event: Event):
    event_id = uuid4().hex
    with SQLiteHandler() as cur:
        cur.execute(
            """
            INSERT INTO events 
            (lat, lon, name, author, location, hrtime, deleteAfter, time, 
            website, description, event_id, verified) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """,
            (event.lat, event.lon, event.name, event.author, event.location, event.hrtime,
             event.deleteAfter, event.time, event.website, event.description, event_id, 0))

        for tag in event.tags.split(","):
            cur.execute(
                "INSERT INTO event_tags (event_id, tag) VALUES (?, ?);",
                (event_id, tag)
            )
    return {"success": True}


@app.get("/admin")
def get_events_admin(request: Request, search_filter):
    if not check_token(request):
        raise HTTPException(status_code=401)
    search_filter = json_loads(search_filter)
    command = "SELECT * FROM events WHERE verified=0"
    for key, item in enumerate(search_filter):
        if key == "tags":
            continue
        command += f" WHERE {key} = '{item}'"

    with SQLiteHandler() as cur:
        cur.execute(command)
        events = list(map(dict, cur.fetchall()))

        for event in events:
            cur.execute(
                "SELECT tag FROM event_tags WHERE event_id = ?",
                (event["event_id"], )
            )
            event["tags"] = ",".join(list(map(lambda x: x["tag"], cur.fetchall())))
    return events


@app.post("/admin")
def verify_event(request: Request, event_id: str):
    if not check_token(request):
        raise HTTPException(status_code=401)
    with SQLiteHandler() as cur:
        cur.execute("UPDATE events SET verified=1 WHERE event_id=?", (event_id,))
        return {"success": True}


@app.delete("/admin")
def delete_event(request: Request, event_id: str):
    if not check_token(request):
        raise HTTPException(status_code=401)
    with SQLiteHandler() as cur:
        cur.execute("DELETE FROM events WHERE event_id=?", (event_id, ))
    return {"success": True}


@app.post("/login")
def login(login_data: dict, response: Response):
    password, username = login_data["password"], login_data["username"]

    if password == "1234" and username == "admin":
        jwt_token = jwt_encode({"hallo": "hi"}, SECRET_KEY)
        response.set_cookie(key=SECRET_KEY, value=jwt_token, samesite="none")
        return {"success": True, "token": jwt_token}
    raise HTTPException(status_code=401, detail="Incorrect username or password")


@app.post("/register")
def create_user(username, password, display_name):
    with SQLiteHandler() as cur:
        user_id = uuid4()
        command = "INSERT INTO user (user_id, username, hashed_password, is_admin, display_name) VALUE (?, ?, ?, ?, ?)"

        hashed_password = hash_it(password + username + SECRET_KEY)

        check_username = "SELECT username FROM user WHERE username=?"

        cur.execute(command, (user_id, username, hashed_password, 0, display_name))
        cur.execute(check_username, (username))




if __name__ == "__main__":
    uvicorn_run(app, host="0.0.0.0", port=8000)
