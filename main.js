//import * as THREE from './build/three.module.js';
import * as THREE from 'three';

import LoadOBJ from './source/loadOBJ.js';
import Scenary from './source/scenary.js';
import Player from './source/player.js';
import Camera from './source/camera.js';
import Interactive from './source/interactive.js';
import Model from './source/model.js';

import Puzzle01 from './source/puzzles/puzzle01.js';
import Puzzle02 from './source/puzzles/puzzle02.js';

//Obtener nivel y cantidad de jugadores
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const no_scenary = urlParams.get('scenary');
const game_mode = urlParams.get('mode');

let COOP = false;
if(game_mode == "coop"){
    COOP = true;
}

let DEV = true;

var count = 0;

var visibleSize;
var clock;
var deltaTime;
var keys = {};

var cameras = [];
var camera01, camera02;

var renderers = [];
var scenes = [];

var pivot01, pivot02;

//Arreglo de colisiones
var arrayCollitions = [];
var arrayPuzzlesCollitions = [];

var player1, player2, player3, player4;


var llave1, llave2, llave3, llave4;
var palanca01, palanca2, palanca3;
var pared01, pared2, pared3, pared4;
var cerca01;
var cerca_central01;

//Puzzles
var puzzle1_1, puzzle1_2, puzzle1_3;
var puzzle2;


//Objs de modelos
var objModels = [];
var pared_obj, cerca_obj, palanca_obj;

//Arreglo de colisiones de objs
var collitionsModels = []

var modelosCargados = [false];
var isWorldReady = [ false, false ];

window.addEventListener('DOMContentLoaded', () => {
    setupScene();

    //Crear modelo de nivel
    var scenary;

    if(no_scenary == 1){
        scenary = new Scenary(
            "assets/models/origen/", 
            "escenario_nieve_2.obj",
            "escenario_nieve_2.mtl",
            1
        );
    }
    if(no_scenary == 2){
        scenary = new Scenary(
            "assets/models/origen/", 
            "escenario_lava.obj",
            "material_global.mtl",
            1
        );     
    }
    if(no_scenary == 3){
        scenary = new Scenary(
            "assets/models/origen/", 
            "escenario_bosque.obj",
            "material_global.mtl",
            1
        );   
    }

    //Cargar objs
    loadModels();

    //Renderizar nivel en las dos escenas
    scenary.renderer(0,0,0, scenes[0], scenes[1]);

    //Cargar modelos interactivos en ambas escenas
    //TODO: Optimizar carga y renderizado de modelos (clone, forEach)

    //cerca_central01 = new Interactive(0, -17.867, 0, 0, 0, 0, 1.2, "assets/models/origen/", "cerca_barrera_2.obj", "cerca_barrera_2.mtl",scenes, arregloObjetosConColision);


    //llave1 = new Interactive(0, 16.8, 301, 0, 0, 0, 1, "assets/models/origen/", "llave.obj", "material_global.mtl",arregloObjetosConColision);
    //llave2 = new Interactive(0, 16.8, -201, 0, 0, 0, 1, "assets/models/origen/", "llave.obj", "material_global.mtl",arregloObjetosConColision);
    //llave3 = new Interactive(0, 30, -430, 0, 0, 0, 1, "assets/models/origen/", "llave.obj", "material_global.mtl",arregloObjetosConColision);
    //llave4 = new Interactive(0, 16.8, -653.297, 0, 0, 0, 1, "assets/models/origen/", "llave.obj", "material_global.mtl",arregloObjetosConColision);
    
    //palanca1 = new Interactive(-83.328, 0, 267.486, 0, 0, 0, 1, "assets/models/origen/", "palanca.obj", "material_global.mtl",arregloObjetosConColision);
    //palanca2 = new Interactive(85.548, 0, 210.204, 0, 180, 0, 1, "assets/models/origen/", "palanca.obj", "material_global.mtl",arregloObjetosConColision);
    //palanca3 = new Interactive(-83.328, 0, 133.062, 0, 0, 0, 1, "assets/models/origen/", "palanca.obj", "material_global.mtl",arregloObjetosConColision);
    
    
    
    //pared2 = new Interactive(0, -17.867, -249.299, 0, 0, 0, 1, "assets/models/origen/", "pared.obj", "material_global.mtl",arregloObjetosConColision);
    //pared3 = new Interactive(0, -17.867, -511.988, 0, 0, 0, 1, "assets/models/origen/", "pared.obj", "material_global.mtl",arregloObjetosConColision);
    //pared4 = new Interactive(0, -17.867, -689.622, 0, 0, 0, 1, "assets/models/origen/", "pared.obj", "material_global.mtl",arregloObjetosConColision);

    //Renderizar modelos interactivos en ambas escenas
    
    //llave1.renderer(scenes[0], scenes[1]);
    //llave2.renderer(scenes[0], scenes[1]);
    //llave3.renderer(scenes[0], scenes[1]);
    //llave4.renderer(scenes[0], scenes[1]);

    //arregloObjetosConColision.push(llave1.objCargado);
    //console.log(llave1.objCargado)

    //palanca1.renderer(scenes[0], scenes[1]);
    //palanca2.renderer(scenes[0], scenes[1]);
    //palanca3.renderer(scenes[0], scenes[1]);

    //pared1.renderer(0, -17.867, 200.96, 0, 0, 0, 1, scenes)
    //pared2.renderer(scenes[0], scenes[1]);
    //pared3.renderer(scenes[0], scenes[1]);
    //pared4.renderer(scenes[0], scenes[1]);

    //puzzle1_1 = new Puzzle01(-200, -18, 500, 0, scenes, arregloObjetosConColision);
    //pared01 = new Interactive(110, -18, 400, 0, 0, 0, 0.6, "assets/models/origen/", "pared_grande.obj", "pared_grande.mtl",scenes, arregloObjetosConColision, "pared_puzzle1");
    if(COOP){
        player1 = new Player(1,-100,-2,500,renderers[0], scenes[0], cameras[0], DEV);  
        player3 = new Player(3,100,-2,500,renderers[0], scenes[0], cameras[0], DEV);

        player2 = new Player(2,-50,-2,345,renderers[1], scenes[1], cameras[1], DEV);  
        player4 = new Player(4,50,-2,345,renderers[1], scenes[1], cameras[1], DEV);
    }else{
        player1 = new Player(1,0,-2,345,renderers[0], scenes[0], cameras[0], DEV);
        player2 = new Player(2,0,-2,345,renderers[1], scenes[1], cameras[1], DEV);    
    }

    isWorldReady[0] = true;
    isWorldReady[1] = true;

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
});

var shown = false;
function onKeyDown(event) {
    if (event.key === "Escape" && shown == false) {
        $(".pausa").fadeIn("fast");
        $(".juego").fadeOut("fast");
        shown = true;
        return;
    }
    if (event.key === "Escape" && shown == true) {
        $(".pausa").fadeOut("fast");
        $(".juego").fadeIn("fast");
        shown = false;
        return;
    }
    //keys[String.fromCharCode(event.keyCode)] = true;
    keys[event.keyCode] = true;
}
function onKeyUp(event) {
    //keys[String.fromCharCode(event.keyCode)] = false;
    keys[event.keyCode] = false;
}

$(".button-pause-1").on('click', function (e) {
    e.preventDefault();
    $(".pausa").fadeOut("fast")
    $(".juego").fadeIn("fast");
    shown = false;
});


function setupScene() {

    visibleSize = { width: window.innerWidth, height: window.innerHeight };
    clock = new THREE.Clock();

    //Iniciar camaras
    camera01 = new Camera(0, 300, 473, visibleSize, cameras, COOP);
    camera02 = new Camera(0, 200, 473, visibleSize, cameras, COOP);

    //Iniciar renders
    createRenderer();
    createRenderer();

    //Crear escenas
    createScene();
    createScene();

    //Materiales
    var transparentMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(1.0, 1.0, 1.0),
        opacity: 0.0,
        transparent: true
    });

    var red = new THREE.MeshLambertMaterial({ color: new THREE.Color(0.5, 0.0, 0.0) });
    var blue = new THREE.MeshLambertMaterial({ color: new THREE.Color(0.0, 0.0, 0.5) });
    var green = new THREE.MeshLambertMaterial({ color: new THREE.Color(0.0, 0.5, 0.0) });
    var yellow = new THREE.MeshLambertMaterial({ color: new THREE.Color(0.5, 0.5, 0.0) });
    var geometry = new THREE.BoxGeometry(1, 1, 1);


    pivot01 = new THREE.Mesh(geometry, transparentMaterial)
    pivot02 = pivot01.clone();
    pivot01.add(cameras[0]);
    scenes[0].add(pivot01);
    pivot02.add(cameras[1]);
    scenes[1].add(pivot02);



    $("#scene-section-1").append(renderers[0].domElement);
    $("#scene-section-2").append(renderers[1].domElement);
}

function render(){
    requestAnimationFrame(render);
    deltaTime = clock.getDelta();

    player1.listenInput(deltaTime, collitionsModels);
    player2.listenInput(deltaTime, collitionsModels);
    //player2.listenInput(deltaTime);


    //player1.checkCollitions(collitionsModels)



    puzzle1_1.update(player1.boxCollition);
    /*
    player1.detectCollitions(arrayCollitions, arrayPuzzlesCollitions);

    if(!puzzle1_1.complete){
        if(player1.action && player1.actionPressed < 1){
            puzzle1_1.collition(player1.getPosX(), player1.getPosZ());    
        }
    }

    if(!puzzle1_2.complete){
        if(player3.action && player3.actionPressed < 1){
            puzzle1_2.collition(player3.getPosX(), player3.getPosZ());    
        }
    }

    if(!puzzle1_3.complete){
        if(player1.action && player1.actionPressed < 1){
            puzzle1_3.collition(player1.getPosX(), player1.getPosZ());    
        }
    }
   */


    //puzzle2.collition(player1.getPosX(), player1.getPosY(), player1.getPosZ(), player1.target)

    

    if(COOP){
        player3.listenInput(deltaTime);
        player4.listenInput(deltaTime);

        //player3.detectCollitions(arrayCollitions);

        camera01.move(player1.getPosX(),player1.getPosZ(), player3.getPosX(),player3.getPosZ());
        camera02.move(player2.getPosZ(),player2.getPosZ(), player4.getPosX(),player4.getPosZ());
    }else{
        camera01.move(player1.getPosX(),player1.getPosZ());
        camera02.move(player2.getPosZ(),player2.getPosZ());
    }



    //pivot01.position.z += moveCamera(pivot01.position.z,player1.getPosZ())
    //pivot02.position.z += moveCamera(pivot02.position.z,player2.getPosZ())



    renderers[0].render(scenes[0], cameras[0]);
    renderers[1].render(scenes[1], cameras[1]);
}



function createRenderer(){
    var renderer = new THREE.WebGLRenderer({ precision: "mediump" });
    renderer.setClearColor(new THREE.Color(0, 0, 0));
    renderer.setPixelRatio((visibleSize.width / 2) / visibleSize.height);
    renderer.setSize(visibleSize.width / 2, visibleSize.height);

    renderers.push(renderer);
}

function createScene(){
    
    var ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 1.0);
    var directionalLight = new THREE.DirectionalLight(new THREE.Color(1, 1, 1), 0.8);
    directionalLight.position.set(0, 1, 1);

    var scene = new THREE.Scene();
    scene.add(ambientLight);
    scene.add(directionalLight);
    scenes.push(scene);
}

//Cargar todos los OBJs
function loadModels(){

    pared_obj = new LoadOBJ("assets/models/origen/","pared_grande.obj", "pared_grande.mtl", finishLoad);
    objModels.push(pared_obj);
    cerca_obj = new LoadOBJ("assets/models/origen/", "cerca_barrera_2.obj", "cerca_barrera_2.mtl",finishLoad);
    objModels.push(cerca_obj);
    palanca_obj = new LoadOBJ("assets/models/origen/", "palanca_roca.obj", "palanca_roca.mtl",finishLoad);
    objModels.push(palanca_obj);
}

//Comprobar si ya se cargaron todos los objs
function finishLoad(){
    var finish = false;
    objModels.forEach(
        element => {
            if(element.ready){
                finish = true;
            }else{
                finish = false;
                return
            }
        }
    );

    //Si ya se cargaron los objs, iniciar los modelos con sus propiedades
    if(finish){
        initModels()
    }

}

function initModels(){

    /*--------CERCAS--------*/

    var cercaClone = cerca_obj.object.clone();
    let fence01 = new Model(0, -17.867, 360,90,1.15, cercaClone, 380, 50, 20, DEV);
    //fence01.activeCollition(collitionsModels)
    fence01.renderer(scenes);

    cercaClone = cerca_obj.object.clone();
    let fence02 = new Model(-200, -17.867, 160,90,1, cercaClone,380, 50, 20, collitionsModels, DEV);
    //fence02.activeCollition(collitionsModels)
    fence02.renderer(scenes);

    cercaClone = cerca_obj.object.clone();
    let fence03 = new Model(-200, -17.867, 540,90,1, cercaClone, 380, 50, 20, collitionsModels, DEV);
    //fence03.activeCollition(collitionsModels)
    fence03.renderer(scenes);

    cercaClone = cerca_obj.object.clone();
    let fence04 = new Model(200, -17.867, 160,90,1, cercaClone,380, 50, 20, collitionsModels, DEV);
    //fence04.activeCollition(collitionsModels)
    fence04.renderer(scenes);

    cercaClone = cerca_obj.object.clone();
    let fence05 = new Model(200, -17.867, 540,90,1, cercaClone, 380, 50, 20, collitionsModels, DEV);
    //fence05.activeCollition(collitionsModels)
    fence05.renderer(scenes);
    

    //pared01 = new Interactive(0, -17.867, 100, 0, 0, 0, 1.14, pared_obj.object, arrayCollitions, "pared01");
    
    //pared01.renderer(scenes)

    //cerca01 = new Interactive(0, -17.867, 0, 0, 0, 0, 1.15, cerca_obj.object, arrayCollitions, "cerca01");
    //cerca01.renderer(scenes)

    //palanca01 = new Interactive(-200, -18, 500, 0, 0, 0, 1.0, palanca_obj.object, arrayCollitions, "palanca01" );
    //palanca01.renderer(scenes)

    puzzle1_1 = new Puzzle01(-180, -18, 400, 0, 100, -18, 400, palanca_obj.object.clone(), pared_obj.object.clone(), collitionsModels, DEV)
    puzzle1_1.renderer(scenes);

    //puzzle1_2 = new Puzzle01(200, -18, 250, 0, -110, -18, 250, palanca_obj.object.clone(), pared_obj.object.clone(), arrayCollitions)
    //puzzle1_2.renderer(scenes[0])

    //puzzle1_3 = new Puzzle01(-200, -18, 100, 0, 110, -18, 100, palanca_obj.object.clone(), pared_obj.object.clone(), arrayCollitions)
    //puzzle1_3.renderer(scenes[0])


    //puzzle2 = new Puzzle02(0, -8, -120, arrayPuzzlesCollitions)
    //puzzle2.renderer(scenes);

    //console.log(arrayCollitions)
    startGame();
}

function startGame(){
    render()
}
