import os
import json
from bs4 import BeautifulSoup

# Función para procesar cada archivo HTML
def procesar_html(archivo_html):
    with open(archivo_html, 'r', encoding='utf-8') as archivo:
        contenido = archivo.read()
        soup = BeautifulSoup(contenido, 'html.parser')

        # Extraer la información relevante
        titulo = soup.find('title').text
        h1_tag = soup.find('h1')
        genero = h1_tag.find_next(text=lambda t: 'Género' in t).split(':')[1].strip()
        anio = int(h1_tag.find_next(text=lambda t: 'Año' in t).split(':')[1].strip())
        reparto = h1_tag.find_next(text=lambda t: 'Reparto' in t).split(':')[1].strip().split(',')
        pais_origen = h1_tag.find_next(text=lambda t: 'País de origen' in t).split(':')[1].strip()
        temporadas = int(h1_tag.find_next(text=lambda t: 'Temporadas' in t).split(':')[1].strip())
        episodios = int(h1_tag.find_next(text=lambda t: 'Episodios' in t).split(':')[1].strip())
        sinopsis = soup.find('h1', text='Sinopsis').find_next('p').text.strip()

        # Extraer el enlace base si existe en el script
        enlace_base = ""
        script_tag = soup.find('script')
        if script_tag and 'rootLink' in script_tag.text:
            root_link_line = [line for line in script_tag.text.split('\n') if 'rootLink' in line]
            if root_link_line:
                enlace_base = root_link_line[0].split('=')[1].strip().replace('"', '')

        # Construir la estructura de temporadas
        temporadas_info = [{
            "nombre": f"Temporada {temporadas}",
            "capitulos": episodios,
            "enlace_base": enlace_base
        }]

        # Crear el diccionario con la información de la novela
        novela_info = {
            "titulo": titulo,
            "genero": genero,
            "anio": anio,
            "reparto": reparto,
            "pais_origen": pais_origen,
            "sinopsis": sinopsis,
            "temporadas": temporadas_info
        }
        return novela_info

# Función para procesar todos los archivos HTML en un directorio
def procesar_directorio(directorio):
    novelas = []
    for archivo in os.listdir(directorio):
        if archivo.endswith('.html'):
            archivo_html = os.path.join(directorio, archivo)
            novela_info = procesar_html(archivo_html)
            novelas.append(novela_info)
    
    # Guardar en un archivo JSON
    with open('novelas.json', 'w', encoding='utf-8') as archivo_json:
        json.dump({"novelas": novelas}, archivo_json, ensure_ascii=False, indent=4)

# Obtener el directorio donde se encuentra el script
directorio_html = os.path.dirname(os.path.abspath(__file__))  # Cambia esta ruta a donde están tus archivos HTML
procesar_directorio(directorio_html)

print("¡Proceso completado! La información de las novelas se ha guardado en 'novelas.json'.")
