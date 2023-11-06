<?php
$fileDirectory = 'upload/'; // Directorio donde se encuentran los archivos a eliminar
$requestData = json_decode(file_get_contents("php://input")); // Obtener los datos de la solicitud POST

if ($requestData && isset($requestData->filename)) {
    $fileName = $requestData->filename;
    // Comprobar si el archivo existe en la carpeta
    if (file_exists($fileDirectory . $fileName)) {
        // Intentar eliminar el archivo
        if (unlink($fileDirectory . $fileName)) {
            $response = array(
                'status' => 'success',
                'message' => 'Archivo eliminado exitosamente'
            );
            echo json_encode($response);
        } else {
            $response = array(
                'status' => 'error',
                'message' => 'Error al eliminar el archivo'
            );
            echo json_encode($response);
        }
    } else {
        $response = array(
            'status' => 'error',
            'message' => 'El archivo no existe'
        );
        echo json_encode($response);
    }
} else {
    $response = array(
        'status' => 'error',
        'message' => 'Datos incorrectos en la solicitud'
    );
    echo json_encode($response);
}
?>