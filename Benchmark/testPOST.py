import requests
import pandas as pd
import time

urlLocal = "http://localhost:8080/sparql/select"

payload = "select * where { service <http://linkedgeodata.org/sparql> { select ?type where { ?s a ?type . filter(regex(UCASE(str(?type)), 'GEOM')) } limit 10 }}"
headers = {
  'Origin': 'http://localhost:8080',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'es-US,es;q=0.9,en-US;q=0.8,en;q=0.7,es-419;q=0.6',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.96 Safari/537.36',
  'Content-Type': 'application/sparql-query;charset=UTF-8',
  'Accept': 'application/sparql-results+json',
  'Referer': 'http://localhost:8080/sparql/admin/squebi.html',
  'Cookie': 'csrftoken=OH0wKFqJ3pvtGP5xogXejF15drga4EmXGK06kZ7Mbi3T2GMHH2Nubg4u55iDmTdW; Idea-b2c1a5cc=639dee9b-a617-43fc-9c1c-d8fbee9a7f4e; JSESSIONID=B4BFE1BD693134DA9F15B62555510094; connect.sid=s%3ALaJinBmFOlNHOjBs9BKEx7U0y0eRFp0l.i5FazoWeYxdhZ%2FfIckjBsmrkufc%2FHhCRv3gQRlIqGiA',
  'Connection': 'keep-alive'
}

#response = requests.request("POST", url, headers=headers, data = payload)
response = requests.post(url=urlLocal, headers=headers, data=payload)
print(response.json())
print(response.status_code)

df = pd.read_excel('ListaSPARQLendpointsActivosWikidata.xlsx')
for n, url in enumerate(df['URL'].tolist()):
	response = requests.post(url=urlLocal, headers=headers, data=payload)
	print(response.status_code)