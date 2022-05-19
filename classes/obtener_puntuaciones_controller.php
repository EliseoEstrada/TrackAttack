<?php 

include "./classes/database.php";

$arrayNombres = array();
$arrayTiempos = array();

$db = new database();
$connection = $db->connect();
$sql = "CALL sp_obtener_puntuaciones()";
$ejecutar = mysqli_query($connection, $sql);
if (!$ejecutar) {
    echo("ERROR: " . mysqli_error($connection));
}
else {
    while ($row = $ejecutar->fetch_assoc()) {
        array_push($arrayNombres, $row['nombre_jugador']);
        array_push($arrayTiempos, $row['tiempo']);
    }
    mysqli_close($connection);
}

?>