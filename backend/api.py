from uuid import uuid4
from json import loads as json_loads
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import run as uvicorn_run

from sqlite_handler import SQLiteHandler
from event import Event

from jwt_coder import jwt_encode, jwt_decode
#JWT_encode takes data and secret and returns the token
#JWT_decode takes token and returns decoded data
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
        command += f" WHERE {key} = '{item}'"

    with SQLiteHandler() as cur:
        cur.execute(command)
        return cur.fetchall()


@app.post("/events")
def create_event(event: Event):
    print("event")
    with SQLiteHandler() as cur:
        cur.execute(
            """
            INSERT INTO events 
            (lat, lon, name, author, location, hrtime, deleteAfter, time, 
            website, tags, description, event_id, verified) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (event.lat, event.lon, event.name, event.author, event.location,
             event.hrtime, event.deleteAfter, event.time, event.website,
             event.tags, event.description, uuid4().hex, 0))
        return [{"message": "Event erfolgreich erstellt"}]
    

@app.get("/admin")
def get_events_admin(search_filter):
    search_filter = json_loads(search_filter)
    command = "SELECT * FROM events WHERE verified=0"
    for key, item in enumerate(search_filter):
        command += f" WHERE {key} = '{item}'"

    with SQLiteHandler() as cur:
        cur.execute(command)
        return cur.fetchall()


@app.post("/admin")
def verify_event(event_id: str):
    with SQLiteHandler() as cur:
        cur.execute("UPDATE events SET verified=1 WHERE event_id=?", (event_id,))


@app.delete("/admin")
def delete_event(event_id: str):
    with SQLiteHandler() as cur:
        cur.execute("DELETE FROM events WHERE event_id=?", (event_id, ))
    return "success"


@app.post("/login")
def login(pw: str, response: Response):
    jwt_token = JWT_encode({}, "key")
    response.set_cookie(key="key", value=jwt_token)
    return {"message": "cookie übergeben :)"}



if __name__ == "__main__":
    uvicorn_run(app, host="0.0.0.0", port=8000)
