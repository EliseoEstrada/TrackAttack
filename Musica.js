
const playCancion = document.getElementsByClassName('play')
const stpCancion = document.getElementsByClassName('stop')
const volumen = document.querySelector('.volumen')

var audio = null;

if(audioR != null){
    audio = audioR;
}

for(elemento of playCancion){
    elemento.addEventListener('click', function(){

        if(audio == null){
            let cancion = this.getAttribute('id')
            audio = new Audio(`./${cancion}.mp3`)
            audio.play()
        }else{
            audio.pause()
            let cancion = this.getAttribute('id')
            audio = new Audio(`./${cancion}.mp3`)
            audio.play()
        }
        
    })

}

for(elemento of stpCancion){
    elemento.addEventListener('click', function(){
        audio.pause()
    })
}

volumen.addEventListener('click', function(){

    let vol = this.value
    if(audio != null){
        audio.volume = vol
    }
    localStorage.setItem('volumen', vol);
})

function setCancion(titulo){
    localStorage.setItem('cancion',  titulo);
}


