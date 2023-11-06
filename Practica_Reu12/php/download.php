<?php
$fileDirectory = '../upload/'; // Directorio donde se encuentran los archivos a descargar
$fileName = $_GET['filename']; // Obtener el nombre del archivo desde la solicitud

// Comprobar si el archivo existe en la carpeta
if (file_exists($fileDirectory . $fileName)) {
    // Configurar las cabeceras para forzar la descarga
    header("Content-type: application/octet-stream");
    header("Content-disposition: attachment; filename=" . $fileName);
    readfile($fileDirectory . $fileName);
} else {
    // Manejar el caso en que el archivo no existe
    echo "El archivo no existe.";
}

?>