import os
import json
from bs4 import BeautifulSoup

# Función para procesar cada archivo HTML
def procesar_html(archivo_html):
    with open(archivo_html, 'r', encoding='utf-8') as archivo:
        contenido = archivo.read()
        soup = BeautifulSoup(contenido, 'html.parser')

        # Extraer la información relevante
        titulo = soup.find('title').text if soup.find('title') else "Sin título"
        h1_tag = soup.find('h1')

        # Validar que h1_tag existe
        if h1_tag is None:
            print(f"Advertencia: No se encontró un h1 en {archivo_html}.")
            return None

        # Función auxiliar para obtener el valor de un campo
        def obtener_valor(campo):
            resultado = h1_tag.find_next(string=lambda t: campo in t)
            if resultado:
                return resultado.split(':')[1].strip()
            else:
                print(f"Advertencia: No se encontró '{campo}' en {archivo_html}.")
                return ""

        # Obtener los valores con la función auxiliar
        genero = obtener_valor('Género')
        anio = obtener_valor('Año')
        reparto = obtener_valor('Reparto').split(',') if obtener_valor('Reparto') else []
        pais_origen = obtener_valor('País de origen')
        temporadas_str = obtener_valor('Temporadas')
        episodios_str = obtener_valor('Episodios')

        # Manejo de conversión a int con verificación
        try:
            temporadas = int(temporadas_str) if temporadas_str.isdigit() else 0
        except ValueError:
            print(f"Advertencia: '{temporadas_str}' no es un número válido para temporadas en {archivo_html}.")
            temporadas = 0

        try:
            episodios = int(episodios_str) if episodios_str.isdigit() else 0
        except ValueError:
            print(f"Advertencia: '{episodios_str}' no es un número válido para episodios en {archivo_html}.")
            episodios = 0

        # Validar que se encuentra la sinopsis
        sinopsis_h1 = soup.find('h1', string='Sinopsis')
        if sinopsis_h1 is None:
            print(f"Advertencia: No se encontró la sinopsis en {archivo_html}.")
            sinopsis = ""
        else:
            sinopsis = sinopsis_h1.find_next('p').text.strip()

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
            "anio": int(anio) if anio.isdigit() else 0,
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
            if novela_info is not None:
                novelas.append(novela_info)
    
    # Guardar en un archivo JSON
    with open('novelas.json', 'w', encoding='utf-8') as archivo_json:
        json.dump({"novelas": novelas}, archivo_json, ensure_ascii=False, indent=4)

# Obtener el directorio donde se encuentra el script
directorio_html = os.path.dirname(os.path.abspath(__file__))
procesar_directorio(directorio_html)

print("¡Proceso completado! La información de las novelas se ha guardado en 'novelas.json'.")
