import sqlite3
from sqlite3 import Error
import sys
import pandas as pd

def create_connection(db_file):
    """ create a database connection to the SQLite database
        specified by db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        print(e)

    return conn


def create_table(conn, create_table_sql):
    """ create a table from the create_table_sql statement
    :param conn: Connection object
    :param create_table_sql: a CREATE TABLE statement
    :return:
    """
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)


def main():
    csv = sys.argv[1]
    database = sys.argv[2]

    sql_create_cities_table = """ CREATE TABLE IF NOT EXISTS cities (
                                    [id] INTEGER PRIMARY KEY,
                                    [name] TEXT,
                                    [population] INTEGER
                                    ); """

    # create a database connection
    conn = create_connection(database)

    # create tables
    if conn is not None:
        create_table(conn, sql_create_cities_table)
    else:
        print("Error! cannot create the database connection.")

    cur = conn.cursor() 
    cities = [];
    df=pd.read_csv(sys.argv[1],header=None)
    for row in df.iterrows():
        print(row[1][0],row[1][1],row[1][2])
        cities.append((row[1][0],row[1][1],row[1][2]))

    sql = ''' INSERT INTO cities(id,name,population) VALUES(?,?,?) '''
    for city in cities:
        cur.execute(sql, city)
    conn.commit()
    print(cur.lastrowid)

if __name__ == '__main__':
    main()
