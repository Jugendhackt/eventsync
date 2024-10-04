from sqlite_handler import SQLiteHandler


def main():
    with SQLiteHandler() as cur:
        cur.execute("""
                CREATE TABLE IF NOT EXISTS events (
                    lat REAL,
                    lon REAL,
                    name TEXT,
                    author TEXT,
                    location TEXT,
                    hrtime TEXT,
                    deleteAfter INT,
                    time TEXT,
                    website TEXT,
                    tags: kommt noch ihr wichser! ihr könnt mich alle mal!
                    description TEXT,
                    createTime TEXT DEFAULT CURRENT_TIMESTAMP,
                    id: TEXT
                )
                """)


if __name__ == "__main__":
    main()
