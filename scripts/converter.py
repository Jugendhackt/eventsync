import csv
import requests
import os.path
import json

rows = []

filename = "datatemp.csv"
if not os.path.isfile(filename):
    filename = "../" + filename # If the file doesn't exist in the current working directory, check the parent directory instead.

with open(filename, 'r') as csvfile:
    csvreader = csv.reader(csvfile)
    next(csvreader)

    for row in csvreader:
        rows.append(row)

for row in rows:
    titles = ("name", "author", "description", "deleteAfter", "hrtime", "location", "tags", "website")
    data = { titles[i]: row[i] for i in range(len(row)) }
    data["lat"] = 0
    data["lon"] = 0
    data["time"] = "ja fickt euch"
    headers = {'content-type': 'application/json'}
    print(headers, data)
    response = requests.post("http://10.42.14.240:8000/events", json=data, headers=headers)
    print(response.status_code, response.reason)
    print(response.content)


