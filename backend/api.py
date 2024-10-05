from uuid import uuid4
from json import loads as json_loads
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sqlite_handler import SQLiteHandler
from event import Event


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/events")
def read_events(search_filter):
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
            website, tags, description, id, verified) 
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
def verify_events(id: str):
    command = "UPDATE verified FROM events WHERE id=?", (id,)

    with SQLiteHandler() as cur:
        cur.execute(command)

@app.delete("/admin")
def delete_events(id: str):
    command = "DELETE * FROM events WHERE id=?", (id,)

    with SQLiteHandler() as cur:
        cur.execute(command)
        