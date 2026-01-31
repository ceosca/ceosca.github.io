import sys
import json
import os
from PyQt5.QtWidgets import QApplication, QWidget, QVBoxLayout, QLabel, QLineEdit, QPushButton, QMessageBox, QFormLayout, QComboBox, QFileDialog, QShortcut
from PyQt5.QtGui import QKeySequence

class CanalInput(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Editor de Canales")
        
        self.filename, _ = QFileDialog.getOpenFileName(self, "Seleccionar Base de Datos", "", "JSON Files (*.json)")
        
        if not self.filename:
            sys.exit()

        self.layout = QVBoxLayout()

        self.combo_canales = QComboBox()
        self.combo_canales.setAccessibleName("Lista de Canales")
        self.layout.addWidget(self.combo_canales)

        self.actualizar_lista_canales()

        form_layout = QFormLayout()

        self.entry_nombre = QLineEdit()
        self.entry_nombre.setAccessibleName("Nombre del canal")
        
        self.entry_categoria = QLineEdit()
        self.entry_categoria.setAccessibleName("Categoría")
        
        self.entry_url = QLineEdit()
        self.entry_url.setAccessibleName("URL del canal")
        
        self.entry_epgid = QLineEdit()
        self.entry_epgid.setAccessibleName("EPG ID")
        
        self.entry_keyId = QLineEdit()
        self.entry_keyId.setAccessibleName("Key ID")
        
        self.entry_key = QLineEdit()
        self.entry_key.setAccessibleName("Key")

        form_layout.addRow(QLabel("Nombre del canal:"), self.entry_nombre)
        form_layout.addRow(QLabel("Categoría:"), self.entry_categoria)
        form_layout.addRow(QLabel("URL del canal:"), self.entry_url)
        form_layout.addRow(QLabel("EPG ID:"), self.entry_epgid)
        form_layout.addRow(QLabel("keyId:"), self.entry_keyId)
        form_layout.addRow(QLabel("key:"), self.entry_key)

        self.layout.addLayout(form_layout)

        self.boton_guardar = QPushButton("Guardar")
        self.boton_guardar.clicked.connect(self.guardar_datos)
        self.layout.addWidget(self.boton_guardar)

        self.boton_eliminar = QPushButton("Eliminar")
        self.boton_eliminar.clicked.connect(self.eliminar_canal)
        self.layout.addWidget(self.boton_eliminar)

        self.shortcut_subir = QShortcut(QKeySequence("Shift+Up"), self)
        self.shortcut_subir.activated.connect(self.accion_subir_canal)

        self.setLayout(self.layout)

        self.combo_canales.currentIndexChanged.connect(self.actualizar_campos)

    def actualizar_lista_canales(self):
        if os.path.exists(self.filename):
            with open(self.filename, 'r', encoding='utf-8') as archivo_existente:
                try:
                    canales = json.load(archivo_existente)
                except json.JSONDecodeError:
                    canales = []
                nombres_canales = [canal.get("nombre", "Sin Nombre") for canal in canales]
                self.combo_canales.clear()
                self.combo_canales.addItems(nombres_canales + ["Nuevo Canal"])

    def actualizar_campos(self):
        nombre_canal_seleccionado = self.combo_canales.currentText()
        if nombre_canal_seleccionado == "Nuevo Canal":
            self.entry_nombre.clear()
            self.entry_categoria.clear()
            self.entry_url.clear()
            self.entry_epgid.clear()
            self.entry_keyId.clear()
            self.entry_key.clear()
        else:
            if os.path.exists(self.filename):
                with open(self.filename, 'r', encoding='utf-8') as archivo_existente:
                    try:
                        canales = json.load(archivo_existente)
                        for canal in canales:
                            if canal.get("nombre") == nombre_canal_seleccionado:
                                self.entry_nombre.setText(canal.get("nombre", ""))
                                self.entry_categoria.setText(canal.get("categoria", ""))
                                self.entry_url.setText(canal.get("url", ""))
                                self.entry_epgid.setText(canal.get("epg_id", ""))
                                self.entry_keyId.setText(canal.get("keyId", ""))
                                self.entry_key.setText(canal.get("key", ""))
                    except json.JSONDecodeError:
                        pass

    def guardar_datos(self):
        nombre = self.entry_nombre.text()
        categoria = self.entry_categoria.text()
        url = self.entry_url.text()
        epgid = self.entry_epgid.text()
        keyId = self.entry_keyId.text()
        key = self.entry_key.text()

        canal = {
            "nombre": nombre,
            "categoria": categoria,
            "url": url,
            "epg_id": epgid,
            "keyId": keyId,
            "key": key
        }

        canales = []
        if os.path.exists(self.filename):
            with open(self.filename, 'r', encoding='utf-8') as archivo_existente:
                try:
                    canales = json.load(archivo_existente)
                except json.JSONDecodeError:
                    canales = []

        nombre_canal_seleccionado = self.combo_canales.currentText()
        
        if nombre_canal_seleccionado == "Nuevo Canal":
            canales.append(canal)
        else:
            for c in canales:
                if c.get("nombre") == nombre_canal_seleccionado:
                    c.update(canal)
                    break

        with open(self.filename, 'w', encoding='utf-8') as archivo_json:
            json.dump(canales, archivo_json, indent=4, ensure_ascii=False)

        QMessageBox.information(self, "Guardado", "Canal guardado exitosamente.")
        self.actualizar_lista_canales()
        
        index = self.combo_canales.findText(nombre)
        if index >= 0:
            self.combo_canales.setCurrentIndex(index)

    def eliminar_canal(self):
        nombre_canal_seleccionado = self.combo_canales.currentText()
        if nombre_canal_seleccionado != "Nuevo Canal":
            confirmacion = QMessageBox.question(self, "Eliminar", f"¿Eliminar '{nombre_canal_seleccionado}'?", QMessageBox.Yes | QMessageBox.No)
            if confirmacion == QMessageBox.Yes:
                if os.path.exists(self.filename):
                    with open(self.filename, 'r', encoding='utf-8') as archivo_existente:
                        canales = json.load(archivo_existente)
                        canales_actualizados = [c for c in canales if c.get("nombre") != nombre_canal_seleccionado]
                    with open(self.filename, 'w', encoding='utf-8') as archivo_json:
                        json.dump(canales_actualizados, archivo_json, indent=4, ensure_ascii=False)
                self.actualizar_lista_canales()

    def accion_subir_canal(self):
        idx = self.combo_canales.currentIndex()
        if idx > 0 and self.combo_canales.currentText() != "Nuevo Canal":
            if os.path.exists(self.filename):
                with open(self.filename, 'r', encoding='utf-8') as f:
                    canales = json.load(f)
                
                if idx < len(canales):
                    canales[idx], canales[idx-1] = canales[idx-1], canales[idx]
                    
                    with open(self.filename, 'w', encoding='utf-8') as f:
                        json.dump(canales, f, indent=4, ensure_ascii=False)
                    
                    self.actualizar_lista_canales()
                    self.combo_canales.setCurrentIndex(idx - 1)

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ventana = CanalInput()
    ventana.show()
    sys.exit(app.exec_())