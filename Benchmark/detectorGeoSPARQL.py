import requests
import pandas as pd
import numpy as np

urlLocal = "http://localhost:8080/sparql/select"
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

# Consulta para buscar SPARQL el tipo de datos en SPARQL
#consulta = "select * where { serivice <> { select distinct ?tipo where { ?sub a ?tipo } }}"
#consulta = str("select * where { service <URL> { select distinct ?tipo where { ?sub a ?tipo } }}")
consulta = str("select * where { service <URL> { select ?type where { ?s a ?type . filter(regex(UCASE(str(?type)), 'GEOM')) } limit 10 }}")
# Se carga el archivo con URL de SPARQL endpoints
df = pd.read_excel('ListaSPARQLendpointsActivosWikidata.xlsx')
# Lista de GeoSPARQL endpoints
geoLista = list([0] * len(df['URL'].tolist()))
# Se recorre cada URL de la lista buscando GeoSPARQL endpoints
for m, url in enumerate(df['URL']):
	Q = consulta.replace('URL', url)
	print(Q)
	try:
		resultado = requests.post(url=urlLocal, headers=headers, data=Q)
		#resultado = requests.request("POST", url, headers=headers, d0ta=Q)
		if resultado.status_code == 200:
			try:
				contenido = resultado.json()
				print('GEO' in str(contenido).upper())
				# Se busca la palabra GEO en la resupesta de la consulta SPARQL
				if 'GEO' in str(contenido).upper():
					geoLista[m] = 1
				else:
					geoLista[m] = 0
			except Exception as e:
				print('Error en extraccion de datos' + str(e))
				geoLista[m] = 0
		else:
			print('Error en peticion - ' + str(resultado.status_code))
			print(resultado)
			geoLista[m] = 0
	except Exception as e:
		print('Error en consulta a SPARQL endpoint' + str(e))
		geoLista[m] = 0
	#if m == 0:
		#break

df['Geo'] = geoLista
# Se guardan los resultados en un Excel
excel = pd.ExcelWriter('GeoListaSPARQLendpointsActivosWikidata.xlsx')
df.to_excel(excel, index=False)
excel.save()
