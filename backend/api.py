from fastapi import FastAPI
from uuid import uuid4

from sqlite_handler import SQLiteHandler


app = FastAPI()


@app.get("/events")
def read_root():
    with SQLiteHandler() as cur:
        cur.execute("SELECT * FROM events")
        return cur.fetchall()
