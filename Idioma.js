const ImagenOpcAtras = document.getElementById('ImagenOpcAtras');
const BotonSI = document.getElementById('BotonSI');
const idBody = document.getElementById('idBody');

if(localStorage.getItem('language') == "esp"){

	ImagenOpcAtras.setAttribute("src", "./recursos/Opciones_Back_Button_Esp.png");
	BotonSI.innerHTML="Seleccionar Idioma: Español";
	idBody.setAttribute("style", "background-image: url('./recursos/Opciones_Esp.png');");

	localStorage.setItem('language', 'esp');
}  

function SeleccionarIdioma(){

    if(localStorage.getItem('language') == "eng" || localStorage.getItem('language') == "null"){
        ImagenOpcAtras.setAttribute("src", "./recursos/Opciones_Back_Button_Esp.png");
        BotonSI.innerHTML="Seleccionar Idioma: Español";
		idBody.setAttribute("style", "background-image: url('./recursos/Opciones_Esp.png');");

        localStorage.setItem('language', 'esp');

    }else{
        ImagenOpcAtras.setAttribute("src", "./recursos/Opciones_Back_Button.png");
        BotonSI.innerHTML="Select language: English";
		idBody.setAttribute("style", "background-image: url('./recursos/Opciones.png');");

        localStorage.setItem('language', 'eng');
    }    

}