from sqlite_handler import SQLiteHandler


def main():
    with SQLiteHandler() as cur:
        cur.execute(
                """
                CREATE TABLE IF NOT EXISTS events (
                    event_id TEXT,
                    name TEXT,
                    author TEXT,
                    description TEXT,
                    create_time TEXT DEFAULT CURRENT_TIMESTAMP,
                    delete_after INT,
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


if __name__ == "__main__":
    main()
