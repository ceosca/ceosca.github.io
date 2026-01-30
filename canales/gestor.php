<?php
/**
 * GESTOR DE CANALES ACCESIBLE (Todo en Uno)
 * Compatible con NVDA
 */

// CONFIGURACIÓN
$archivo_db = 'db.json';
$password_secreta = '1234'; 

// --- LÓGICA PHP PARA GUARDAR (BACKEND) ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verificar que sea una solicitud AJAX de guardado
    header('Content-Type: text/plain');

    $pass_recibida = $_POST['password'] ?? '';
    $datos_json = $_POST['datos'] ?? '';

    if ($pass_recibida !== $password_secreta) {
        http_response_code(403);
        echo "Contraseña incorrecta";
        exit;
    }

    if (empty($datos_json)) {
        http_response_code(400);
        echo "No hay datos para guardar";
        exit;
    }

    // Guardar archivo
    if (file_put_contents($archivo_db, $datos_json)) {
        echo "OK";
    } else {
        http_response_code(500);
        echo "Error de permisos. Verifica que db.json tenga CHMOD 777.";
    }
    exit; // Terminar ejecución PHP aquí para no mostrar el HTML
}

// --- LÓGICA PHP PARA LEER (Carga inicial) ---
$contenido_inicial = "[]";
if (file_exists($archivo_db)) {
    $contenido_inicial = file_get_contents($archivo_db);
    // Si el archivo está vacío o corrupto, evitar errores JS
    if (empty($contenido_inicial) || $contenido_inicial === 'null') {
        $contenido_inicial = "[]";
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestor de Canales (PHP)</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; color: #333; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        h1, h2 { text-align: center; color: #004494; }
        
        /* Accesibilidad */
        .sr-only { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0; }
        button:focus, input:focus { outline: 4px solid #0056b3; background-color: #fff9db; }

        /* Formulario */
        .editor-box { background: #eef; padding: 20px; border: 2px solid #004494; border-radius: 8px; margin-bottom: 30px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; font-weight: bold; margin-bottom: 5px; font-size: 1.1rem; }
        input { width: 100%; padding: 12px; font-size: 1.1rem; border: 2px solid #555; border-radius: 5px; box-sizing: border-box; }
        
        /* Botones */
        .btn-row { display: flex; gap: 15px; justify-content: center; margin-top: 20px; flex-wrap: wrap; }
        button { padding: 15px 25px; font-size: 1.1rem; font-weight: bold; cursor: pointer; border: 2px solid #333; border-radius: 5px; }
        .btn-save { background: #006400; color: white; }
        .btn-cancel { background: #ddd; color: black; }
        
        /* Botón de subida destacado */
        .btn-upload { 
            background: #b22222; color: white; width: 100%; margin-top: 20px; 
            font-size: 1.3rem; padding: 20px; border: 3px solid #500;
        }
        .btn-upload:hover { background: #d00; }

        /* Lista */
        .channel-list { list-style: none; padding: 0; }
        .channel-item { background: #fff; border: 1px solid #ccc; padding: 20px; margin-bottom: 15px; border-radius: 8px; }
        .channel-header { font-size: 1.3rem; font-weight: bold; margin-bottom: 10px; color: #000; }
        .channel-details { font-size: 1rem; margin-bottom: 15px; color: #444; line-height: 1.5; }
        .actions { display: flex; gap: 15px; }
        .btn-edit { background: #0056b3; color: white; }
        .btn-del { background: #8b0000; color: white; }
    </style>
</head>
<body>

<div class="container">
    <h1>🛠️ Gestor de Canales (Todo en Uno)</h1>
    
    <!-- Región para que NVDA hable -->
    <div id="status-live" class="sr-only" aria-live="polite"></div>

    <!-- Formulario -->
    <div class="editor-box">
        <h2 id="form-title" tabindex="-1">Agregar Nuevo Canal</h2>
        
        <div class="form-group"><label for="f-nombre">Nombre del Canal:</label><input type="text" id="f-nombre"></div>
        <div class="form-group"><label for="f-categoria">Categoría:</label><input type="text" id="f-categoria"></div>
        <div class="form-group"><label for="f-epg">Enlace EPG (Guía):</label><input type="text" id="f-epg"></div>
        <div class="form-group"><label for="f-url">URL MPD:</label><input type="text" id="f-url"></div>
        <div class="form-group"><label for="f-keyid">Key ID (Licencia):</label><input type="text" id="f-keyid"></div>
        <div class="form-group"><label for="f-key">Key (Clave):</label><input type="text" id="f-key"></div>
        
        <input type="hidden" id="f-index" value="-1">

        <div class="btn-row">
            <button class="btn-save" onclick="guardarEnLista()">💾 Guardar en la Lista Temporal</button>
            <button class="btn-cancel" onclick="limpiarFormulario()">Cancelar Edición</button>
        </div>
    </div>

    <hr>
    <h2>Lista de Canales (<span id="count">0</span>)</h2>
    <p style="text-align:center">Recuerda: Los cambios no son públicos hasta que pulsas el botón rojo.</p>
    
    <!-- Botón para enviar a PHP -->
    <button class="btn-upload" onclick="guardarEnServidor()">☁️ GUARDAR CAMBIOS EN SERVIDOR</button>
    
    <ul id="lista-canales" class="channel-list"></ul>
</div>

<script>
    // Inyectamos el JSON directamente desde PHP al cargar la página
    // Esto evita problemas de caché y hace la carga instantánea
    var canales = <?php echo $contenido_inicial; ?>;

    // --- FUNCIONES AUXILIARES ---
    function narrar(texto) {
        const live = document.getElementById('status-live');
        live.innerText = texto;
        // Limpiamos brevemente para permitir repetir mensajes
        setTimeout(() => live.innerText = '', 1000);
    }

    function $(id) { return document.getElementById(id); }

    // --- RENDERIZADO ---
    function renderizar() {
        const lista = $('lista-canales');
        $('count').innerText = canales.length;
        lista.innerHTML = '';

        canales.forEach((c, index) => {
            const li = document.createElement('li');
            li.className = 'channel-item';
            
            const epgStatus = c.epg ? "✅ Tiene EPG" : "❌ Sin EPG";
            const urlCorta = c.url.length > 40 ? "..." + c.url.slice(-30) : c.url;

            li.innerHTML = `
                <div class="channel-header">${c.nombre} <span style="font-size:0.9em; font-weight:normal">(${c.categoria})</span></div>
                <div class="channel-details">
                    <strong>URL:</strong> ${urlCorta}<br>
                    <strong>Estado:</strong> ${epgStatus}
                </div>
                <div class="actions">
                    <button class="btn-edit" onclick="editar(${index})">Editar ${c.nombre}</button>
                    <button class="btn-del" onclick="eliminar(${index})">Eliminar ${c.nombre}</button>
                </div>
            `;
            lista.appendChild(li);
        });
    }

    // --- EDICIÓN ---
    function editar(index) {
        const c = canales[index];
        $('f-nombre').value = c.nombre || '';
        $('f-categoria').value = c.categoria || '';
        $('f-url').value = c.url || '';
        $('f-keyid').value = c.keyId || '';
        $('f-key').value = c.key || '';
        $('f-epg').value = c.epg || '';
        
        $('f-index').value = index;
        $('form-title').innerText = "Editando: " + c.nombre;
        $('form-title').focus(); // Llevar foco al título del formulario
        narrar("Cargado canal " + c.nombre + " para editar");
        window.scrollTo(0, 0);
    }

    function guardarEnLista() {
        const nombre = $('f-nombre').value;
        const index = parseInt($('f-index').value);

        if (!nombre) {
            alert("El nombre es obligatorio");
            narrar("Error: Falta el nombre");
            return;
        }

        const nuevoObj = {
            nombre: nombre,
            categoria: $('f-categoria').value,
            url: $('f-url').value,
            keyId: $('f-keyid').value,
            key: $('f-key').value,
            epg: $('f-epg').value
        };

        if (index === -1) {
            canales.push(nuevoObj);
            narrar("Canal agregado a la lista temporal");
        } else {
            canales[index] = nuevoObj;
            narrar("Canal actualizado en la lista temporal");
        }

        renderizar();
        limpiarFormulario();
    }

    function eliminar(index) {
        if (confirm("¿Estás seguro de eliminar " + canales[index].nombre + "?")) {
            canales.splice(index, 1);
            renderizar();
            narrar("Canal eliminado de la lista temporal");
            $('form-title').focus();
        }
    }

    function limpiarFormulario() {
        $('f-nombre').value = '';
        $('f-categoria').value = '';
        $('f-url').value = '';
        $('f-keyid').value = '';
        $('f-key').value = '';
        $('f-epg').value = '';
        $('f-index').value = '-1';
        $('form-title').innerText = "Agregar Nuevo Canal";
        narrar("Formulario limpiado");
    }

    // --- GUARDAR EN SERVIDOR (AJAX) ---
    function guardarEnServidor() {
        const pass = prompt("🔑 Introduce la contraseña para guardar cambios en el servidor:");
        if (!pass) return;

        narrar("Enviando datos al servidor...");

        const formData = new FormData();
        formData.append('password', pass);
        // Enviamos el array convertido a texto JSON
        formData.append('datos', JSON.stringify(canales, null, 2));

        // Nos enviamos los datos a nosotros mismos (al mismo archivo PHP)
        fetch('', { 
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) return response.text();
            throw new Error("Error HTTP: " + response.status);
        })
        .then(texto => {
            if (texto.trim() === "OK") {
                alert("✅ ¡Base de datos actualizada con éxito!");
                narrar("Éxito. Cambios guardados en el servidor.");
            } else {
                alert("❌ Error: " + texto);
                narrar("Error al guardar: " + texto);
            }
        })
        .catch(err => {
            console.error(err);
            alert("❌ Error de conexión");
            narrar("Error de conexión, no se pudo guardar.");
        });
    }

    // Inicializar al cargar
    document.addEventListener('DOMContentLoaded', () => {
        renderizar();
        narrar("Gestor listo. " + canales.length + " canales cargados.");
    });
</script>

</body>
</html>