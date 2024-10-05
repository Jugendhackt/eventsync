from uuid import uuid4
from json import loads as json_loads
from fastapi import FastAPI, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import run as uvicorn_run

from sqlite_handler import SQLiteHandler
from event import Event
from jwt_coder import jwt_encode, jwt_decode


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


def check_cookie(request):
    cookie = request.cookies.get("key")
    print(cookie)
    if cookie is None:
        cookie = "Cookie"
    decoded = jwt_decode(cookie, "key")
    return decoded == {"hallo": "hi"}


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
    return {"result": "success"}


@app.get("/admin")
def get_events_admin(request: Request, search_filter):
    if check_cookie(request):
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
    return {"result": "failed"}


@app.post("/admin")
def verify_event(request: Request, event_id: str):
    if check_cookie(request) is True:
        with SQLiteHandler() as cur:
            cur.execute("UPDATE events SET verified=1 WHERE event_id=?", (event_id,))
            return {"result": "success"}
    return {"result": "failed"}


@app.delete("/admin")
def delete_event(request: Request, event_id: str):
    if check_cookie(request) is True:
        with SQLiteHandler() as cur:
            cur.execute("DELETE FROM events WHERE event_id=?", (event_id, ))
        return {"result": "success"}
    return {"result": "failed"}


@app.post("/login")
def login(login_data: dict, response: Response):
    password, username = login_data["password"], login_data["username"]

    if password == "1234":
        jwt_token = jwt_encode({"hallo": "hi"}, "key")
        response.set_cookie(key="key", value=jwt_token)
        return {"message": "cookie übergeben :)"}
    return {"result": "failed", "message": "password incorrect"}


if __name__ == "__main__":
    uvicorn_run(app, host="0.0.0.0", port=8000)
