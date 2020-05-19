# contains functions for accessing the octopiAPI
import requests

def octopiGET(printer, url, data = {}):
    payload = {'apikey' : printer['apikey']}
    r = requests.get('http://' + printer['address'] + '/api' + url, params=payload, data = data)
    return r

def octopiMultiGET(printers, url, data = {}):
    responses = []
    for printer in printers:
        responses.append(octopiGET(printer, url, data))
    return responses

def octopiPOST(printer, url, data = {}):
    payload = {'apikey' : printer['apikey']}
    r = requests.post('http://' + printer['address'] + '/api' + url, params=payload, data = data)
    return r