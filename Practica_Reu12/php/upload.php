<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $uploadDir = 'file/'; // Directorio donde se almacenarán los archivos subidos

    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true); // Crea el directorio si no existe
    }

    if ($_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $tempFile = $_FILES['file']['tmp_name'];
        $originalFileName = $_FILES['file']['name'];

        // Genera un nombre único para el archivo
        $newFileName = uniqid() . '_' . $originalFileName;
        $uploadPath = $uploadDir . $newFileName;

        // Mueve el archivo subido al directorio de destino
        if (move_uploaded_file($tempFile, $uploadPath)) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Archivo subido exitosamente',
                'file_name' => $newFileName,
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Error al subir el archivo',
            ]);
        }
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Error al subir el archivo: ' . $_FILES['file']['error'],
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Solicitud no válida',
    ]);
}
?>