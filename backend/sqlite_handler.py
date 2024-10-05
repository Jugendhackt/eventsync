from sqlite3 import connect
from yaml import load as yaml_load, SafeLoader


with open("config.yaml", "rt", encoding="utf-8") as f:
    config = yaml_load(f, Loader=SafeLoader)

DB_PATH = config["database_path"]


class SQLiteHandler:
    def __init__(self, file=DB_PATH):
        self.file = file

    def __enter__(self):
        self.conn = connect(self.file)
        # self.conn.row_factory = sqlite3.Row
        return self.conn.cursor()

    def __exit__(self, err_type, value, traceback):
        self.conn.commit()
        self.conn.close()
