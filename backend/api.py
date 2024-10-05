from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
from pydantic import BaseModel
from json import loads as json_loads

from sqlite_handler import SQLiteHandler


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class Event(BaseModel):
    lat: float
    lon: float
    name: str
    author: str
    location: str
    hrtime: str
    deleteAfter: int
    time: str
    website: str
    tags: str
    description: str

@app.get("/events")
def read_root(search_filter):
    search_filter = json_loads(search_filter)
    command = "SELECT * FROM events WHERE verified=True"
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
            (event["lat"], event["lon"], event["name"], event["author"], event["location"],
             event["hrtime"], event["deleteAfter"], event["time"], event["website"],
             event["tags"], event["description"], uuid4().hex))
        return {"message": "Event created successfully"}
