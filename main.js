//import * as THREE from './build/three.module.js';
import * as THREE from 'three';

import LoadOBJ from './source/loadOBJ.js';
import Scenary from './source/scenary.js';
import Player from './source/player.js';
import Camera from './source/camera.js';
import Model from './source/model.js';

import Puzzle01 from './source/puzzles/puzzle01.js';
import Puzzle02 from './source/puzzles/puzzle02.js';

//Obtener nivel y cantidad de jugadores
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const no_scenary = urlParams.get('scenary');
const game_mode = urlParams.get('mode');

let COOP = false;
if (game_mode == "coop") {
    COOP = true;
}
let DIFFICULTY;
let PAUSE = false;
let DEV = true;


var visibleSize;
var clock;
var deltaTime;
var keys = {};

var cameras = [];
var camera01, camera02;

var renderers = [];
var scenes = [];


//Variables de jugadores
var player1, player2, player3, player4;


//Puzzles
var puzzle1_1_s1, puzzle1_2_s1, puzzle1_3_s1;
var puzzle1_1_s2, puzzle1_2_s2, puzzle1_3_s2;
var puzzle2_s1, puzzle2_s2;


//Objs de modelos
var objModels = [];
var pared_obj, cerca_obj, palanca_obj, puente_obj;

//Arreglo de colisiones de objs
var modelsCollitions = []
//Arreglo de colisiones de puzzles
var puzzlesCollitions_s1 = []
var puzzlesCollitions_s2 = []

var modelosCargados = [false];
var isWorldReady = [false, false];

window.addEventListener('DOMContentLoaded', () => {
    setupScene();

    //Crear modelo de nivel
    var scenary;

    if (no_scenary == 1) {
        scenary = new Scenary(
            "assets/models/origen/",
            "escenario_nieve_2.obj",
            "escenario_nieve_2.mtl",
            1
        );
    }
    if (no_scenary == 2) {
        scenary = new Scenary(
            "assets/models/origen/",
            "escenario_lava_2.obj",
            "material_global.mtl",
            1
        );
    }
    if (no_scenary == 3) {
        scenary = new Scenary(
            "assets/models/origen/",
            "escenario_bosque_2.obj",
            "material_global.mtl",
            1
        );
    }

    //Cargar objs
    loadModels();

    //Renderizar nivel en las dos escenas
    scenary.renderer(0, 0, 0, scenes[0], scenes[1]);


    //llave1 = new Interactive(0, 16.8, 301, 0, 0, 0, 1, "assets/models/origen/", "llave.obj", "material_global.mtl",arregloObjetosConColision);
    //palanca1 = new Interactive(-83.328, 0, 267.486, 0, 0, 0, 1, "assets/models/origen/", "palanca.obj", "material_global.mtl",arregloObjetosConColision);


    if (COOP) {
        player1 = new Player(1, -100, -2, 500, renderers[0], scenes[0], cameras[0], DEV);
        player3 = new Player(3, 100, -2, 500, renderers[0], scenes[0], cameras[0], DEV);

        player2 = new Player(2, -50, -2, 500, renderers[1], scenes[1], cameras[1], DEV);
        player4 = new Player(4, 50, -2, 500, renderers[1], scenes[1], cameras[1], DEV);
    } else {
        player1 = new Player(1, 0, -2, 500, renderers[0], scenes[0], cameras[0], DEV);
        player2 = new Player(2, 0, -2, 500, renderers[1], scenes[1], cameras[1], DEV);
    }

    //isWorldReady[0] = true;
    //isWorldReady[1] = true;

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
});

var shown = false;
function onKeyDown(event) {
    if (event.key === "Escape" && shown == false) {
        $(".pausa").fadeIn("fast");
        $(".juego").fadeOut("fast");
        shown = true;
        PAUSE = true;
        return;
    }
    if (event.key === "Escape" && shown == true) {
        $(".pausa").fadeOut("fast");
        $(".juego").fadeIn("fast");
        shown = false;
        PAUSE = false;
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
    PAUSE = false;
});


function setupScene() {

    visibleSize = { width: window.innerWidth, height: window.innerHeight };
    clock = new THREE.Clock();

    //Iniciar camaras
    camera01 = new Camera(0, 300, 100, visibleSize, cameras, COOP);
    camera02 = new Camera(0, 300, 473, visibleSize, cameras, COOP);

    //Iniciar renders
    createRenderer();
    createRenderer();

    //Crear escenas
    createScene();
    createScene();

    $("#scene-section-1").append(renderers[0].domElement);
    $("#scene-section-2").append(renderers[1].domElement);
}

function render() {

    deltaTime = clock.getDelta();
    requestAnimationFrame(render);

    if (!PAUSE) {

        //Actualizar jugador
        player1.update(deltaTime, modelsCollitions, puzzlesCollitions_s1);
        player2.update(deltaTime, modelsCollitions, puzzlesCollitions_s2);
        if (COOP) {
            player3.update(deltaTime, modelsCollitions, puzzlesCollitions_s1);
            player4.update(deltaTime, modelsCollitions, puzzlesCollitions_s2);
        }

        ////////////////////////////////PRIMER MINIJUEGO////////////////////////////////
        //--------------------------------Scena 1--------------------------------
        if (!puzzle1_1_s1.complete) {
            if (player1.action && player1.actionPressed < 1) {
                puzzle1_1_s1.update(player1.boxCollition, puzzlesCollitions_s1);
            }
        }
        if (COOP) {
            if (!puzzle1_2_s1.complete) {
                if (player3.action && player3.actionPressed < 1) {
                    puzzle1_2_s1.update(player3.boxCollition, puzzlesCollitions_s1);
                }
            }
        }
        if (!puzzle1_3_s1.complete) {
            if (player1.action && player1.actionPressed < 1) {
                puzzle1_3_s1.update(player1.boxCollition, puzzlesCollitions_s1);
            }
        }

        //--------------------------------Scena 2--------------------------------
        if (!puzzle1_1_s2.complete) {
            if (player2.action && player2.actionPressed < 1) {
                puzzle1_1_s2.update(player2.boxCollition, puzzlesCollitions_s2);
            }
        }
        if (COOP) {
            if (!puzzle1_2_s2.complete) {
                if (player4.action && player4.actionPressed < 1) {
                    puzzle1_2_s2.update(player4.boxCollition, puzzlesCollitions_s2);
                }
            }
        }
        if (!puzzle1_3_s2.complete) {
            if (player2.action && player2.actionPressed < 1) {
                puzzle1_3_s2.update(player2.boxCollition, puzzlesCollitions_s2);
            }
        }


        ////////////////////////////////SEGUNDO MINIJUEGO////////////////////////////////
        //--------------------------------Scena 1--------------------------------
        if (!puzzle2_s1.complete) {
            puzzle2_s1.update(player1.boxCollition, player1.action, player3.boxCollition, player3.action);
        }
        //--------------------------------Scena 2--------------------------------
        if (!puzzle2_s2.complete) {
            puzzle2_s2.update(player2.boxCollition, player2.action, player4.boxCollition, player4.action);
        }




        //Actualizar camaras
        if (COOP) {
            camera01.move(player1.getPosX(), player1.getPosZ(), player3.getPosX(), player3.getPosZ());
            camera02.move(player2.getPosZ(), player2.getPosZ(), player4.getPosX(), player4.getPosZ());
        } else {
            camera01.move(player1.getPosX(), player1.getPosZ());
            camera02.move(player2.getPosZ(), player2.getPosZ());
        }

        //Renderear escena
        renderers[0].render(scenes[0], cameras[0]);
        renderers[1].render(scenes[1], cameras[1]);
    }
}



function createRenderer() {
    var renderer = new THREE.WebGLRenderer({ precision: "mediump" });
    renderer.setClearColor(new THREE.Color(0, 0, 0));
    renderer.setPixelRatio((visibleSize.width / 2) / visibleSize.height);
    renderer.setSize(visibleSize.width / 2, visibleSize.height);

    renderers.push(renderer);
}

function createScene() {

    var ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 1.0);
    var directionalLight = new THREE.DirectionalLight(new THREE.Color(1, 1, 1), 0.8);
    directionalLight.position.set(0, 1, 1);

    var scene = new THREE.Scene();
    scene.add(ambientLight);
    scene.add(directionalLight);
    scenes.push(scene);
}

//Cargar todos los OBJs
function loadModels() {

    pared_obj = new LoadOBJ("assets/models/origen/", "pared_grande.obj", "pared_grande.mtl", finishLoad);
    objModels.push(pared_obj);
    cerca_obj = new LoadOBJ("assets/models/origen/", "cerca_barrera_2.obj", "cerca_barrera_2.mtl", finishLoad);
    objModels.push(cerca_obj);
    palanca_obj = new LoadOBJ("assets/models/origen/", "palanca_roca.obj", "palanca_roca.mtl", finishLoad);
    objModels.push(palanca_obj);
    puente_obj = new LoadOBJ("assets/models/origen2/", "puente.obj", "material_global.mtl", finishLoad);
    objModels.push(puente_obj);
}

//Comprobar si ya se cargaron todos los objs
function finishLoad() {
    var finish = false;
    objModels.forEach(
        element => {
            if (element.ready) {
                finish = true;
            } else {
                finish = false;
                return
            }
        }
    );

    //Si ya se cargaron los objs, iniciar los modelos con sus propiedades
    if (finish) {
        initObjects()
    }

}

function initObjects() {

    /*--------CERCAS--------*/


    //var cercaClone = cerca_obj.obj.clone();
    var fence01 = new Model(0, -17.867, 360, 90, 1.15, cerca_obj.obj.clone(), 380, 50, 20, DEV);
    fence01.activeCollition(modelsCollitions)
    fence01.renderer(scenes);

    var fence02 = new Model(-200, -17.867, 160, 90, 1, cerca_obj.obj.clone(), 380, 50, 20, DEV);
    fence02.activeCollition(modelsCollitions)
    fence02.renderer(scenes);

    var fence03 = new Model(-200, -17.867, 540, 90, 1, cerca_obj.obj.clone(), 380, 50, 20, DEV);
    fence03.activeCollition(modelsCollitions)
    fence03.renderer(scenes);

    var fence04 = new Model(200, -17.867, 160, 90, 1, cerca_obj.obj.clone(), 380, 50, 20, DEV);
    fence04.activeCollition(modelsCollitions)
    fence04.renderer(scenes);

    var fence05 = new Model(200, -17.867, 540, 90, 1, cerca_obj.obj.clone(), 380, 50, 20, DEV);
    fence05.activeCollition(modelsCollitions)
    fence05.renderer(scenes);

    var fence06 = new Model(-220, -17.867, -35, 0, 1, cerca_obj.obj.clone(), 380, 50, 20, DEV);
    fence06.activeCollition(modelsCollitions)
    fence06.renderer(scenes);

    var fence07 = new Model(220, -17.867, -35, 0, 1, cerca_obj.obj.clone(), 380, 50, 20, DEV);
    fence07.activeCollition(modelsCollitions)
    fence07.renderer(scenes);

    var fence08 = new Model(-220, -17.867, -195, 0, 1, cerca_obj.obj.clone(), 380, 50, 20, DEV);
    fence08.activeCollition(modelsCollitions)
    fence08.renderer(scenes);

    var fence09 = new Model(220, -17.867, -195, 0, 1, cerca_obj.obj.clone(), 380, 50, 20, DEV);
    fence09.activeCollition(modelsCollitions)
    fence09.renderer(scenes);


    //PUZZLE 1 MUROS
    puzzle1_1_s1 = new Puzzle01(-180, -18, 400, 0, 100, -18, 400, palanca_obj.obj.clone(), pared_obj.obj.clone(), puzzlesCollitions_s1, DEV)
    puzzle1_1_s1.renderer(scenes[0]);

    puzzle1_2_s1 = new Puzzle01(180, -18, 300, 0, -100, -18, 300, palanca_obj.obj.clone(), pared_obj.obj.clone(), puzzlesCollitions_s1, DEV)
    puzzle1_2_s1.renderer(scenes[0]);

    puzzle1_3_s1 = new Puzzle01(-180, -18, 200, 0, 100, -18, 200, palanca_obj.obj.clone(), pared_obj.obj.clone(), puzzlesCollitions_s1, DEV)
    puzzle1_3_s1.renderer(scenes[0]);

    puzzle1_1_s2 = new Puzzle01(-180, -18, 400, 0, 100, -18, 400, palanca_obj.obj.clone(), pared_obj.obj.clone(), puzzlesCollitions_s2, DEV)
    puzzle1_1_s2.renderer(scenes[1]);

    puzzle1_2_s2 = new Puzzle01(180, -18, 300, 0, -100, -18, 300, palanca_obj.obj.clone(), pared_obj.obj.clone(), puzzlesCollitions_s2, DEV)
    puzzle1_2_s2.renderer(scenes[1]);

    puzzle1_3_s2 = new Puzzle01(-180, -18, 200, 0, 100, -18, 200, palanca_obj.obj.clone(), pared_obj.obj.clone(), puzzlesCollitions_s2, DEV)
    puzzle1_3_s2.renderer(scenes[1]);

    //PUZZLE 2 PUENTE
    puzzle2_s1 = new Puzzle02(0, 0, -110, 90, 0, 0, -110, puente_obj.obj.clone(), palanca_obj.obj.clone(), puzzlesCollitions_s1, DEV)
    puzzle2_s1.renderer(scenes[0]);

    puzzle2_s2 = new Puzzle02(0, 0, -110, 90, 0, 0, -110, puente_obj.obj.clone(), palanca_obj.obj.clone(), puzzlesCollitions_s2, DEV)
    puzzle2_s2.renderer(scenes[1]);

    //Iniciar juego cuando todo este listo
    startGame();
}

function startGame() {
    render()
}
