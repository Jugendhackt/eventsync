from fastapi import FastAPI
from uuid import uuid4
from fastapi.middleware.cors import CORSMiddleware

from sqlite_handler import SQLiteHandler


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/events")
def read_root():
    with SQLiteHandler() as cur:
        cur.execute("SELECT * FROM events")
        return cur.fetchall()


@app.post("/events")
def create_event(event):
    event["id"] = uuid4().hex
    with SQLiteHandler() as cur:
        cur.execute(
            """
            INSERT INTO events 
            (lat, lon, name, author, location, hrtime, deleteAfter, time, 
            website, tags, description, id) 
            VALUES (?)
            """,
            (event["lat"], event["lon"], event["name"], event["author"], event["location"],
             event["hrtime"], event["deleteAfter"], event["time"], event["website"],
             event["tags"], event["description"], uuid4()))
