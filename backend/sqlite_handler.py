from sqlite3 import connect


db_path = 'db/contentdb.db'


class SQLiteHandler:
    def __init__(self, file=db_path):
        self.file = file

    def __enter__(self):
        self.conn = connect(self.file)
        # self.conn.row_factory = sqlite3.Row
        return self.conn.cursor()

    def __exit__(self, err_type, value, traceback):
        self.conn.commit()
        self.conn.close()
