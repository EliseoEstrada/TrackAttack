function registrarRanking(){
    var formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('tiempo', tiempo);
    formData.append('registrar', 1);
    $.ajax({
            url: "./classes/registrar_puntuaciones_controller.php",
        type: "POST",
        data: formData,
        success: function(msg){
            console.log(msg)
            okay = msg;
        },
        cache: false,
        contentType: false,
        processData: false,
        async: false
    });
}

