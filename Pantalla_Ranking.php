<?php include('./classes/obtener_puntuaciones_controller.php')?>

<!DOCTYPE html>
<html lang="es">
    <head>
        <title>Pantalla principal</title>
        <meta http-equiv="Content-Type" content="text/html" charset="UTF-8" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="https://kit.fontawesome.com/fd0511d7e0.js" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-/bQdsTh/da6pkI1MST/rWKFNjaCP5gBSY4sEBT38Q/9RBh9AH40zEOg7Hlq2THRZ" crossorigin="anonymous"></script>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
        <link href="./css/my_css.css" rel="stylesheet" >
    </head>

    <style>
        body {
            background-position: center;
            background-image: url('./recursos/Ranking.png');
            background-repeat: no-repeat;
            background-attachment: fixed;
            background-color: rgb(103, 250, 255);
        }
    </style>


<body id="idBody" style="background-image: url('./recursos/Ranking.png');">

    <audio controls autoplay loop hidden id="audioR">
        
    </audio>

    <div class="ranking-container">

        <?php if(isset($arrayNombres)){ for($i = 0; $i < count($arrayNombres); $i++){ ?>
            <div class="half-screen"><?php echo($i+1)?>. <?php echo($arrayTiempos[$i]) ?></div>
            <div style="margin-left: 30px; margin-right: 30px; display: inline-block; opacity: 0;">Prueba</div>
            <div class="half-screen" style="margin-bottom: 5px;"><?php echo($arrayNombres[$i]) ?></div>
            <br>
        <?php }} ?> 
        
    </div>
        <a class="button-ranking-1" href="index.html"><img id="btnBack" src="./recursos/Ranking_Back_Button.png"></a>

        <script type="text/javascript">
        if(localStorage.getItem('language') == "esp"){

            const btnBack = document.getElementById('btnBack');
            const idBody = document.getElementById('idBody');
        
            btnBack.setAttribute("src", "./recursos/Ranking_Back_Button_Esp.png");
            idBody.setAttribute("style", "background-image: url('./recursos/Ranking_Esp.png');");
        } 

        if(localStorage.getItem('cancion') != null){

            const audioR = document.getElementById('audioR');
            audioR.innerHTML = '<source src="./assets/sounds/'+localStorage.getItem('cancion')+'" type="audio/mpeg">';
            if(localStorage.getItem('volumen') != null){
                audioR.volume = localStorage.getItem('volumen');
            }

        }else{

            const audioR = document.getElementById('audioR');        
            audioR.innerHTML = '<source src="MENU - No Doubt - Yung Logos.mp3" type="audio/mpeg">';

        }

    </script>
</body>
</html>