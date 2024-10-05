from sqlite_handler import SQLiteHandler


def main():
    with SQLiteHandler() as cur:
        cur.executescript("""
                CREATE TABLE IF NOT EXISTS events (
                    lat         REAL NOT NULL,
                    lon         REAL NOT NULL,
                    name        TEXT NOT NULL,
                    author      TEXT NOT NULL,
                    location    TEXT NOT NULL,
                    hrtime      TEXT NOT NULL,
                    deleteAfter INT  NOT NULL,
                    time        TEXT NOT NULL,
                    website     TEXT NOT NULL,
                    description TEXT NOT NULL,
                    createTime  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    event_id          TEXT NOT NULL PRIMARY KEY,
                    verified    INT  NOT NULL DEFAULT 0
                );
                CREATE TABLE IF NOT EXISTS event_tags (
                    tag         TEXT NOT NULL,
                    event_id    TEXT,
                    FOREIGN KEY (event_id)  REFERENCES events(id)
                )
                """)


if __name__ == "__main__":
    main()
