import csv
import requests
import os.path

rows = []

url = input("Input url to send requests to (leave empty for default): ")
url = url if url else "http://10.42.14.240:8000/events" # overwrite input if empty

filename = input("Input file name (leave empty for datatemp.csv): ")
filename = filename if filename else "datatemp.csv" # overwrite input if empty
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
    data["time"] = ""
    headers = {'content-type': 'application/json'}
    print(headers, data)
    response = requests.post(url, json=data, headers=headers)
    print(response.status_code, response.reason)
    print(response.content)
