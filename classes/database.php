<?php
class database{

    public function connect(){
        $server="localhost";
        $username="root";
        $password="root";
        $database="track_attack";

        $conn = mysqli_connect($server,$username,$password,$database);
        return $conn;
    }

}
?>