from pydantic import BaseModel


class Event(BaseModel):
    lat: float
    lon: float
    name: str
    author: str
    location: str
    hrtime: str
    deleteAfter: int
    time: str
    website:  str
    tags: str
    description: str
    id: str
