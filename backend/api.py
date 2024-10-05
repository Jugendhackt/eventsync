from uuid import uuid4
from json import loads as json_loads
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import run as uvicorn_run

from sqlite_handler import SQLiteHandler
from event import Event
from jwt_coder import jwt_encode, user_id_from_request, check_token_admin, check_token_admin_deco
from hashing import to_hash


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


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


@app.post("/event/like")
def like_event(request: Request, body: dict):
    event_id, like, user_id = body["event_id"], body["like"], user_id_from_request(request)
    with SQLiteHandler() as cur:
        cur.execute("DELETE FROM likes WHERE event_id = ? AND user_id = ?", (event_id, user_id))
        if like:
            cur.execute("INSERT INTO likes (user_id, event_id) VALUES (?, ?)", (user_id, event_id))


@app.get("/admin")
def get_events_admin(request: Request, search_filter):
    if not check_token_admin(request):
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


@app.get("/admin/users")
@check_token_admin_deco
def get_users_admin(request: Request, _):
    with SQLiteHandler() as cur:
        cur.execute("SELECT user_id, username, display_name, is_admin FROM users")
        return cur.fetchall()


@app.delete("/admin/user")
@check_token_admin_deco
def delete_user(request: Request, body: dict):
    user_id = body["user_id"]
    with SQLiteHandler() as cur:
        cur.execute("DELETE FROM users WHERE user_id = ?", (user_id, ))
    return {"success": True, "message": f"User deleted: {user_id}"}


@app.post("/admin")
@check_token_admin_deco
def verify_event(request: Request, body: dict):
    event_id = body["event_id"]
    with SQLiteHandler() as cur:
        cur.execute("UPDATE events SET verified=1 WHERE event_id=?", (event_id,))
        return {"success": True}


@app.post("/admin/op")
@check_token_admin_deco
def verify_event(request: Request, body: dict):
    user_id, is_admin = body["user_id"], 1 if body["is_admin"] else 0
    with SQLiteHandler() as cur:
        cur.execute("UPDATE users SET is_admin=? WHERE user_id=?", (is_admin, user_id))
        return {"success": True}


@app.delete("/admin")
def delete_event(request: Request, event_id: str):
    if not check_token_admin(request):
        raise HTTPException(status_code=401)
    with SQLiteHandler() as cur:
        cur.execute("DELETE FROM events WHERE event_id=?", (event_id, ))
    return {"success": True}


@app.post("/login")
def login(login_data: dict):
    password, username = login_data["password"], login_data["username"]

    hashed_password = to_hash(password, salt=username)

    with SQLiteHandler() as cur:
        cur.execute("SELECT hashed_password FROM users WHERE username=?", (username,))
        if cur.fetchone()["hashed_password"] != hashed_password:
            raise HTTPException(status_code=401, detail="Incorrect username or password")

        cur.execute("SELECT is_admin, username, display_name, user_id FROM users WHERE username=?", (username, ))
        user = cur.fetchone()

        jwt_token = jwt_encode({
            "is_admin": bool(user["is_admin"]),
            "user_id": user["user_id"],
            "username": user["username"]
        })

        return {
            "success": True,
            "token": jwt_token,
            "is_admin": bool(user["is_admin"]),
            "username": user["username"],
            "display_name": user["display_name"]
        }


@app.post("/user/register")
def create_user(user_data: dict):
    username, password, display_name = user_data["username"], user_data["password"], user_data["display_name"]
    if display_name == "":
        raise HTTPException(status_code=400, detail="display name cannot be empty")

    with SQLiteHandler() as cur:
        cur.execute("SELECT username FROM users WHERE username=?", (username,))
        if len(cur.fetchall()) != 0:
            raise HTTPException(status_code=409, detail="Chosen username is already in use")

        hashed_password = to_hash(password, salt=username)
        user_id = uuid4().hex
        cur.execute(
            "INSERT INTO users (user_id, username, hashed_password, is_admin, display_name) VALUES (?, ?, ?, ?, ?)",
            (user_id, username, hashed_password, 0, display_name)
        )

    jwt_token = jwt_encode({
        "is_admin": False,
        "user_id": user_id,
        "username": username
    })

    return {
            "success": True,
            "token": jwt_token,
            "is_admin": False,
            "username": username,
            "display_name": display_name
        }


@app.get("/user/likes")
def get_likes(request: Request):
    user_id = user_id_from_request(request)
    with SQLiteHandler() as cur:
        cur.execute("SELECT * FROM likes WHERE user_id=?", (user_id, ))
        return list(map(lambda x: x["event_id"], cur.fetchall()))


if __name__ == "__main__":
    uvicorn_run(app, host="0.0.0.0", port=8000)
