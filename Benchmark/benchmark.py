import requests as r
import time
import pandas as pd
import numpy as np

tripleStores = ['Apache Marmotta']
URL_select = ['http://localhost:8080/sparql/select']
URL_update = ['http://localhost:8080/sparql/update']

headersMarmotta = {
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

headers = [headersMarmotta]

# Se leen las consultas
consultas = pd.read_excel('consultas.xlsx')
# Numero de corridas
corridas = 100

def ejecutaConsulta(I, Q, U, H):
	# Vector de tiempos
	T = [0] * corridas
	for m in range(corridas):
		inicio = time.time()
		R = r.post(U, headers=H, data=Q)
		if R.status_code == 200:
			t = time.time() - inicio
		else:
			t = np.nan
		T[m] = t
		# Se eliminar el grafo para luego cargar nuevamente el grafo
		if I == 'Q3':
			eliminaGrafo = "delete where { graph <http://www.example.com/ont#books> {?s ?p ?o } . }"
			R = r.post(U, headers=H, data=Q)
	return T

# Se inicializa el Dataframe que contenga todos los resultados.
cols = ['TripleStore', 'Consulta', 'Limite', 'Tiempo']
df = pd.DataFrame(columns=cols)
# Se extrae informacion necesaria sobre la cantidad de consultas
variaciones = consultas.shape[0]
limites = [250, 500, 1000, 2500, 5000]
listaConsultas = list(consultas.columns.values)
# Se inicia el benchmark
for ts, urlS, urlU, header in zip(tripleStores, URL_select, URL_update, headers):
	for indice in listaConsultas:
		for variacion in range(variaciones):
			query = consultas[indice][variacion]
			#print('Indice: ' + indice + '\tQuery: ' + query)
			#print('=' * 30)
			if indice == 'Q3':
				resulTiempo = ejecutaConsulta(indice, query, urlU, header)
			else:
				resulTiempo = ejecutaConsulta(indice, query, urlS, header)
			# Se mete el valor respectivo de la N-aba corrida
			for i in range(corridas):
				df = df.append({
								'TripleStore': ts,
								'Consulta': indice,
								'Limite':limites[variacion],
								'Tiempo': resulTiempo[i]
								},
								ignore_index = True)

#print(df)
# Se guarda el Dataframe en excel
excel = pd.ExcelWriter('ResultadosBenchmarkFinal.xlsx')
df.to_excel(excel, index=False)
excel.save()
