<?php

include "./classes/database.php";

if (isset($_POST['registrar'])){
    $nombre = $_POST['nombre'];
    $tiempo = $_POST['tiempo'];
    registrarPuntuacion($nombre, $tiempo);
}

function registrarPuntuacion($nombre, $tiempo){
    $db = new database();
    $connection = $db->connect();
    $sql = "CALL sp_registrar_puntuacion('$nombre', '$tiempo')";
    $ejecutar = mysqli_query($connection,$sql);
    if($ejecutar == null){
        echo("ERROR: " . mysqli_error($connection));
    }else{
        echo("true");
    }
}

?>