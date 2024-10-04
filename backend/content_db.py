import aiosqlite
import asyncio

db_path = 'backend/db/contentdb.db'

class ContentDBInit:
    def __init__(self):
        self.db_path = db_path

    async def init_db(self):
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute(
                """
                CREATE TABLE IF NOT EXISTS content_db (
                    event_id TEXT,
                    name TEXT,
                    author TEXT,
                    description TEXT,
                    type INTEGER,
                    create_time TEXT DEFAULT CURRENT_TIMESTAMP,
                    delete_after TEXT,
                    time TEXT,
                    hrtime TEXT,
                    location TEXT,
                    coordinates_lat REAL,
                    coordinates_lan REAL,
                    tags TEXT,
                    website TEXT
                )
                """
            )
            await db.commit()
            print("Datenbank erstellt")

async def main():
    db_init = ContentDBInit()
    await db_init.init_db()

if __name__ == '__main__':
    asyncio.run(main())

