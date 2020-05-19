import csv
import octopiAPI
import requests

printers = []
with open('home.printers') as f:
    reader = csv.reader(f)
    for row in reader:
        printers.append({'address': row[0], 'apikey': row[1]})

print(printers)

payload = {'apikey' : printers[0]['apikey']}

#r = octopiAPI.octopiPOST(printers[0], '/access/users', {'name': 'testuser', 'password': 'password', 'active': 'true', 'admin': 'false'})
r =  requests.post('http://' + printers[0]['address'] + '/api/access/users', params=payload, json = {'name': 'testuser', 'password': 'password', 'active': 'true'})
print(r.status_code)
rjson = r.json()
