-import requests
import time
import pandas as pd
import numpy as np

tripleStores = ['Apache Marmotta']
URL = ['http://localhost:8080/sparql/select']

headers = {
	'Origin': 'http://localhost:8080',
	'Accept-Encoding': 'gzip, deflate, br',
	'Accept-Language': 'es-US,es;q=0.9,en-US;q=0.8,en;q=0.7,es-419;q=0.6',
	'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.96 Safari/537.36',
	'Content-Type': 'application/sparql-update;charset=UTF-8',
	'Accept': 'application/json, text/plain, */*',
	'Referer': 'http://localhost:8080/sparql/admin/squebi.html',
	'Cookie': 'csrftoken=OH0wKFqJ3pvtGP5xogXejF15drga4EmXGK06kZ7Mbi3T2GMHH2Nubg4u55iDmTdW; Idea-b2c1a5cc=639dee9b-a617-43fc-9c1c-d8fbee9a7f4e; JSESSIONID=B4BFE1BD693134DA9F15B62555510094; connect.sid=s%3AniII-YAn_hmTJeOM7QUQjcHa5Q3WZNjj.PMuY3dZskUvA6RT1Fr%2BgqDc19%2BAKkFv2S70x4D0JggI',
  'Connection': 'keep-alive'
}


# Se leen las consultas de un excel con consultas predefinidas
consultas = pd.read_excel('consultas.xlsx')
listaConsultas = list(consultas.columns.values)
# Consultas del mismo tipo pero limite distinto
difLimCons = consultas.shape[0]
# Limites de consulta
limites = [250, 500, 1000, 2500, 5000]

# Se crea dataframe donde se guarda el tiempo invertido en la consulta
cols = ['TripleStore', 'url', '#Consulta', 'Limite', 'Tiempo']
df = pd.DataFrame(columns=cols)

for m in range(30):
	for ts, url in zip(tripleStores, URL):
		for n, consulta in enumerate(listaConsultas):
			for x in range(difLimCons):
				inicio = time.time()
				Q = consultas[consulta][x]
				#print(Q)
				resultado = requests.post(url, headers=headers, data=Q)
				if resultado.status_code != 200:
					duracion = np.nan
				else:
					duracion = time.time() - inicio
				#df.loc[n] = [ts, url, n, duracion]
				df = df.append({'TripleStore':ts, 'url':url, '#Consulta':n+1, 'Limite':limites[x], 'Tiempo':duracion}, ignore_index=True)
				#print(str(resultado.json()))
		
#print(df)
# Se guarda el resultado
excel = pd.ExcelWriter('ResultadosBenchmark.xlsx')
df.to_excel(excel, index=False)
excel.save()
