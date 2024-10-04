from fastapi import FastAPI
from ..event import Event


app = FastAPI()

@app.get("/events")
def read_root():
    return [Event(1, 4, "test")]


# json object of all events
