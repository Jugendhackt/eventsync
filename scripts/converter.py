import csv
import requests
import os.path
import sys

rows = []

url = input("Input url to send requests to (leave empty for default): ")
if not url:
    print("YOU NEED TO PROVIDE A URL.")
    print("dumbass")
    sys.exit(69)

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
    headers = {'content-type': 'application/json'}
    titles = ("name", "author", "description", "hrtime", "location", "tags", "website", "lat", "lon", "deleteAfter", "time")
    data = { titles[i]: row[i] for i in range(len(row)) }
    print(headers, data)
    response = requests.post(url, json=data, headers=headers)
    print(response.status_code, response.reason)
    print(response.content)
