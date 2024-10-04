import csv
import requests

filename = "../datatemp.csv"

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
    response = requests.post("http://10.42.14.240:8000", data)


