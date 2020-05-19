import csv
import octopiAPI
import requests

printers = []
with open('home.printers') as f:
    reader = csv.reader(f)
    for row in reader:
        printers.append({'address': row[0], 'apikey': row[1]})

print(printers)

r = octopiAPI.octopiGET(printers[0], '/files/local/test/Custom_pulley_%281%29_0.2mm_PETG_MK3_1h3m.gcode')
print(r.status_code)
rjson = r.json()
print(float(rjson['gcodeAnalysis']['filament']['tool0']['volume']) * 1.24 / 1000)

#downloadURL = rjson['children'][0]['refs']['download']
#print(downloadURL)

#r = requests.get(downloadURL + '?apikey=' + printers[0]['apikey'])
#open('test.txt', 'wb').write(r.content)