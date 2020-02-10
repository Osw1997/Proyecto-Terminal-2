# Importando librerías necesarias para el Web Scrapper
import requests
import urllib.request
import time
from bs4 import BeautifulSoup
import re # Librería para expresiones regulares
from selenium import webdriver # Librería para renderizar el HTML
from requests_html import HTMLSession
import numpy
import csv

# https://lod-cloud.net/clouds/lod-cloud.svg

def get_geourls(url_set):
    session = HTMLSession();
    resp = session.get(url_set);
    resp.html.render();
    soup = BeautifulSoup(resp.html.html, "html.parser");
    total_etiquetas = len(soup.findAll(class_ = "badge badge-primary"));
    # Bandera que indica que las etiquetas del triple store contiene geo-datos
    flag_geo = False;
    # Se analiza cada etiqueta
    labels = [];
    for m in range(total_etiquetas):
        # Se indica que etiquetas HTML se deben de extraer
        one_a_tag = soup.findAll(class_ = "badge badge-primary")[m];
        # Se guardan dichas etiquetas
        #labels.append(re.sub('[^A-Za-z0-9]+', '', one_a_tag.contents[0]));
        labels.append(one_a_tag.contents[0]);
        # Se extraen las etiqueta de cada burbuja
        # y se checa que tenga asociado la preposición 'geo'
        if (re.findall('geo', one_a_tag.contents[0])):
            flag_geo = True;
    # En dado caso que el triple store contenga geodatos, se continua con la extracción de datos
    if (flag_geo):
        print("Datos Geoespaciales");
        # # Con base al DOM de la página, se lleva a cabo la siguiente búsqueda y extracción de datos
        # Sitio Web
        try:
            website = soup.findAll(class_ = "website")[0].findAll('a')[0]['href'];
        except:
            print("Triple store sin website");
            website = 'NA'
        print(website);
        # Total de tripletas
        total_triples = soup.findAll(class_ = "table table-striped")[0].findAll('td')[1].contents[0];
        #print(total_triples);
        #print(type(total_triples));
        resp.close();
        session.close();
        return [website, total_triples, labels];
    # En caso negativo, se regresa de la función para continuar con el siguiente enlace
    else:
        print("No geodatos");
        resp.close();
        session.close();
        return;



#info = get_geourls("https://lod-cloud.net/dataset/geolinkeddata")
#print(len(info));
#print("\n");
#info = get_geourls("https://lod-cloud.net/dataset/enakting-co2emission");
#print(len(info));
def get_urls(cantidad):
    # URL donde extraer la info
    url = 'https://lod-cloud.net/clouds/lod-cloud.svg';
    #url = 'http://web.mta.info/developers/turnstile.html';
    # Se establece la conexión a la URL
    response = requests.get(url);
    # Se utiliza la herramienta BeautifulSoup para traducir el HTML en una
    # estructura 'BeautifulSoup'
    soup = BeautifulSoup(response.text, 'html.parser');
    # Se cuentan cuantas burbujas hay que analizar
    total_burbujas = len(soup.findAll('a'));
    print(total_burbujas)
    #total_burbujas = cantidad;
    # Array de todas las URLs a analizar
    url_burbujas = [];
    # Se analiza cada burbuja
    for m in range(total_burbujas):
        # Se indica que etiquetas HTML se deben de extraer
        one_a_tag = soup.findAll('a')[m];
        # Se extraen las URLs de cada burbuja
        link = one_a_tag['href'];
        url_burbujas.append(link);
    with open("LinkedDataURL.csv", "w") as f:
        for url in url_burbujas:
            f.write("%s\n" % url);

def get_geoinfo():
    url_burbujas = [];
    with open('LinkedDataURL.csv', newline='') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
        url_burbujas = list(spamreader)
        #for row in spamreader:
        #    url_burbujas.insert(row);
    #    print(', '.join(row))
    # Se imprimen las URLs usadas
    #print(len(url_burbujas));
    print(url_burbujas);
    # Se extraen las páginas que contienen geodatos
    info = [['URL', 'Website', 'Total tripletas', 'Etiquetas'],];
    separador = ','
    for indx, url in enumerate(url_burbujas):
        print(indx);
        info_per_url = [0,0,0,0]
        info_per_url[0] = url[0]
        data = get_geourls(url[0]);
        if (data is not None):
            info_per_url[1] = data[0]
            info_per_url[2] = data[1]
            info_per_url[3] = separador.join(data[2])
            info.append(info_per_url);
    print(info);
    print(type(info));

    #a = numpy.asarray(info)
    print('\n' * 2)

    with open("LinkedData_completo.csv", "w") as f:
        writer = csv.writer(f)
        writer.writerows(info)
    #print(a);
    #numpy.savetxt("LinkedData.csv", a, delimiter=" ")

# Inicio web scrapping
#get_urls(0);
get_geoinfo();
