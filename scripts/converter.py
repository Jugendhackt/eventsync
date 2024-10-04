import csv
import requests
import os.path

filename = "datatemp.csv"
if not os.path.isfile(filename):
    filename = "../" + filename # If the file doesn't exist in the current working directory, check the parent directory instead.

rows = []

with open(filename, 'r') as csvfile:
    # creating a csv reader object
    csvreader = csv.reader(csvfile)
    next(csvreader)

    for row in csvreader:
        rows.append(row)
    
for row in rows:
    titles = ("name", "author", "description", "delete_after", "hrtime", "location", "tags", "website")
    data = { titles[i]: row[i] for i in range(len(row)) }
    data["lat"] = 0
    data["lon"] = 0
    data["time"] = 0
    response = requests.post("http://10.42.14.240:8000/events", data)


