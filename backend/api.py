from uuid import uuid4
from json import loads as json_loads
from fastapi import FastAPI, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import run as uvicorn_run

from sqlite_handler import SQLiteHandler
from event import Event

from jwt_coder import jwt_encode, jwt_decode
#JWT_encode takes data and secret and returns the token
#JWT_decode takes token and returns decoded data
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
    if cookie == None:
        cookie = "Cookie"
    decoded = jwt_decode(cookie, "key")
    if decoded == {"hallo": "hi"}:
        return True
    else:
        return False


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
    return "success"


@app.get("/admin")
def get_events_admin(request: Request, search_filter):
    if check_cookie(request) is True:
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
    if check_cookie(request) is True:
        with SQLiteHandler() as cur:
            cur.execute("UPDATE events SET verified=1 WHERE event_id=?", (event_id,))
            return {"message": "toll du bist drinnen bro"}
    else:
        return {"message": "sry Bro"}


@app.delete("/admin")
def delete_event(request: Request, event_id: str):
    if check_cookie(request) is True:
        with SQLiteHandler() as cur:
            cur.execute("DELETE FROM events WHERE event_id=?", (event_id, ))
        return {"message": "toll du bist drinnen bro"}
    else:
        return {"message": "sry Bro"}


@app.post("/login")
def login(pw: str, response: Response):
    if pw == "1234":
        jwt_token = jwt_encode({"hallo": "hi"}, "key")
        response.set_cookie(key="key", value=jwt_token)
        return {"message": "cookie übergeben :)"}
    else:
        return {"error": "Passwort falsch"}



if __name__ == "__main__":
    uvicorn_run(app, host="0.0.0.0", port=8000)
