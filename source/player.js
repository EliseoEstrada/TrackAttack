import * as THREE from 'three';

import { FBXLoader } from '../jsm/modules.js';

export default class Player {
    constructor(noPlayer, posX, posY, posZ, render, scene, camera, DEV) {

        this.noPlayer = noPlayer;
        this.input = new PlayerControllerInput(this.noPlayer);

        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;

        this.prePoxX;
        this.prePoxY;
        this.prePoxZ;

        this.speed = 80;


        this.render = render;
        this.scene = scene
        this.camera = camera


        /* -------- */
        this.pathModel = "../trackattack/assets/models/personaje/";
        this.pathAnimation = "../trackattack/assets/models/personaje/animaciones/";
        this.modelFile = "personaje.fbx";

        this.mixer;                 //almacena keyframes
        this.modelReady = false;    //Define cuando el jugador se termina de cargar
        this.animationActions;      //Almacena animaciones
        this.activeAction;          //Accion actual
        this.lastAction;            //Ultima accion

        this.action = false;
        this.actionPressed = 0;



        var opacity = (DEV) ? 0.5 : 0.0 ;
        var transparentMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(1.0, 0.0, 0.0),
            opacity: opacity,
            transparent: true
        });

        var geometry = new THREE.BoxGeometry(15,50,25);
        this.box = new THREE.Mesh(geometry, transparentMaterial);
        this.box.position.set(this.posX, this.posY + 15, this.posZ);
        this.boxCollition = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.boxCollition.setFromObject(this.box);

        this.isCollision = false;

        this.init();
    }

    init(){

        this.loadModel();
        this.animate();
    }


    loadModel(){

        const fbxLoader = new FBXLoader();
        fbxLoader.setPath(this.pathModel);
        this.animationActions = []

        fbxLoader.load(
            this.modelFile, 
            (object) => {

                //Posicionar modelo
                object.position.set(this.posX, this.posY, this.posZ);
                object.rotation.y = THREE.Math.degToRad(180)
                object.scale.setScalar(1);
                this.target = object;
                const mixer = new THREE.AnimationMixer(object);
                this.mixer = mixer;

                //console.log("jugador cargado");

                fbxLoader.setPath(this.pathAnimation);
                fbxLoader.load(
                    'Idle.fbx',
                    (object) => {

                        const clip = object.animations[0];
                        const action = mixer.clipAction(clip);

                        this.animationActions.push(action)

                        //this.animations['idle'] = {
                        //    clip: clip,
                        //    action: action,
                        //};
                        //
                        //this.animationActions.push(this.animations['idle'])

                        fbxLoader.load(
                            'Fast_run.fbx',
                            (object) => {
        
                                const clip = object.animations[0];
                                const action = mixer.clipAction(clip);
                                this.animationActions.push(action)
                                

                                fbxLoader.load(
                                    'Standing Torch Light Torch From Wall.fbx',
                                    (object) => {
                
                                        const clip = object.animations[0];
                                        const action = mixer.clipAction(clip);

                                        //action.setLoop(THREE.LoopOnce)
                                        this.animationActions.push(action)
                                    
                                        //personaje listo
                                        this.modelReady = true;
                                        //Iniciar estado
                                        this.activeAction = this.animationActions[0];
                                        //Agregar a la escena
                                        this.scene.add(this.target);
                                        //Agregar colision a la escena
                                        this.scene.add(this.box);
                                        //Iniciar animacion
                                        this.animationActions[0].play();

                                    },
                                    (xhr) => {
                                        //console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                                    },
                                    (error) => {
                                        console.log(error)
                                    }
                                )

                            },
                            (xhr) => {
                                //console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                            },
                            (error) => {
                                console.log(error)
                            }
                        )

                    },
                    (xhr) => {
                        //console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                    },
                    (error) => {
                        console.log(error)
                    }
                )
                
            
            },
            (xhr) => {
                //console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )
    }

    rotate(direction, deltaTime) {
        var yaw = 5;
        var rotation = (yaw * direction) * deltaTime;
        this.target.rotation.y += rotation;
        this.box.rotation.y += rotation;
        this.boxCollition.copy(this.box.geometry.boundingBox).applyMatrix4(this.box.matrixWorld)
    }

    move(direction, deltaTime, modelsCollitions, puzzlesCollitions) {
        
        this.setAction('run');

        this.box.position.set(this.target.position.x,this.target.position.y + 15, this.target.position.z);
        this.box.translateZ(-direction * 20);
        this.boxCollition.copy(this.box.geometry.boundingBox).applyMatrix4(this.box.matrixWorld)
   

        if(!this.checkCollitions(modelsCollitions, puzzlesCollitions)){
            
            this.target.translateZ((direction * this.speed) * deltaTime);

        }

    }

    checkCollitions(modelsCollitions, puzzlesCollitions){
        
        this.isCollision = false;
        
        modelsCollitions.forEach(
            element => {
                if(this.boxCollition.intersectsBox(element)){
                    this.isCollision = true;
                }
            }
        );
       

        puzzlesCollitions.forEach(
            element => {
                if(this.boxCollition.intersectsBox(element)){
                    this.isCollision = true;
                }
            }
        );

        return this.isCollision;
    }

    update(deltaTime, collitionsModels, puzzlesCollitions){
        if (!this.modelReady){
            return;
        }
        
        if(this.input.keys.forward){

            this.move(1, deltaTime, collitionsModels, puzzlesCollitions );

        }
        else if(this.input.keys.backward){

            this.move(-1, deltaTime, collitionsModels, puzzlesCollitions );

        }else if(this.input.keys.action){

            this.setAction('action');
            this.action = true;
            if(this.actionPressed < 1){
                this.actionPressed += 0.1;
            }

        }else{

            this.action = false;
            this.actionPressed = 0;
            this.setAction('idle');
            this.box.position.set(this.target.position.x,this.target.position.y + 15, this.target.position.z);
        }
        
        if(this.input.keys.left){

            this.rotate(1, deltaTime)

        }
        else if(this.input.keys.right){

            this.rotate(-1, deltaTime)

        }
        

    }


    setAction(state){
        
        var toAction;

        switch(state){
            case 'idle':
                toAction = 0;
                break;
            case 'run':
                toAction = 1;
                break;
            case 'action':
                toAction = 2;
                break;
            case 'dance':
                toAction = 3;
                break;
        }

        if (this.animationActions[toAction] != this.activeAction) {
            this.lastAction = this.activeAction
            this.activeAction = this.animationActions[toAction]
            //lastAction.stop()
            this.lastAction.fadeOut(0.1)
            this.activeAction.reset()
            this.activeAction.fadeIn(0.1)


            this.activeAction.play()

        }
    }

    getPosX() {
        if (!this.modelReady){
            return;
        }
        return this.target.position.x;
    }
    getPosY() {
        if (!this.modelReady){
            return;
        }
        return this.target.position.y;
    }
    getPosZ() {
        if (!this.modelReady){
            return;
        }
        return this.target.position.z;
    }


    /*  Animar modelo */
    animate() {
        //this.input.keys.forward;
        //this.input.keys.backward;
        //this.input.keys.left;
        //this.input.keys.right;
        //this.input.keys.action;

        

        requestAnimationFrame((t) => {
            
            if (this.previousRAF === null) {
                this.previousRAF = t;
            }

            this.animate();

            this.render.render(this.scene, this.camera);
            this.step(t - this.previousRAF);
            this.previousRAF = t;
        });
    }

    step(timeElapsed) {
        const timeElapsedS = timeElapsed * 0.001;

        if (this.modelReady){
            this.mixer.update(timeElapsedS)
        }
    }


}



class PlayerControllerInput {
    constructor(noPlayer) {
        this.noPlayer = noPlayer;
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            action: false,
        };
        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
    }

    onKeyDown(event) {

        if(this.noPlayer == 1){
            switch (event.keyCode) {
                case 87: // w
                    this.keys.forward = true;
                    break;
                case 65: // a
                    this.keys.left = true;
                    break;
                case 83: // s
                    this.keys.backward = true;
                    break;
                case 68: // d
                    this.keys.right = true;
                    break;

                case 69: // e
                    this.keys.action = true;
                break;
            }
        }

        if(this.noPlayer == 2){
            switch (event.keyCode) {
                case 38: // up
                    this.keys.forward = true;
                    break;
                case 37: // left
                    this.keys.left = true;
                    break;
                case 40: // down
                    this.keys.backward = true;
                    break;
                case 39: // right
                    this.keys.right = true;
                    break;
                case 97: // 1
                    this.keys.action = true;
                    break;
            }
        }

        if(this.noPlayer == 3){
            switch (event.keyCode) {
                case 73: // i
                    this.keys.forward = true;
                    break;
                case 74: // j
                    this.keys.left = true;
                    break;
                case 75: // k
                    this.keys.backward = true;
                    break;
                case 76: // l
                    this.keys.right = true;
                    break;
                case 79: // o
                    this.keys.action = true;
                break;
            }
        }

        if(this.noPlayer == 4){
            switch (event.keyCode) {
                case 104: // 8
                    this.keys.forward = true;
                    break;
                case 100: // 4
                    this.keys.left = true;
                    break;
                case 101: // 5
                    this.keys.backward = true;
                    break;
                case 102: // 6
                    this.keys.right = true;
                    break;
                case 105: // 9
                    this.keys.action = true;
                    break;
            }
        }
    }

    onKeyUp(event) {
        if(this.noPlayer == 1){
            switch (event.keyCode) {
                case 87: // w
                    this.keys.forward = false;
                    break;
                case 65: // a
                    this.keys.left = false;
                    break;
                case 83: // s
                    this.keys.backward = false;
                    break;
                case 68: // d
                    this.keys.right = false;
                    break;
                case 69: // e
                    this.keys.action = false;
                break;
            }
        }

        if(this.noPlayer == 2){
            switch (event.keyCode) {
                case 38: // up
                    this.keys.forward = false;
                    break;
                case 37: // left
                    this.keys.left = false;
                    break;
                case 40: // down
                    this.keys.backward = false;
                    break;
                case 39: // right
                    this.keys.right = false;
                    break;
                case 97: // 1
                    this.keys.action = false;
                    break;
            }
        }

        if(this.noPlayer == 3){
            switch (event.keyCode) {
                case 73: // i
                    this.keys.forward = false;
                    break;
                case 74: // j
                    this.keys.left = false;
                    break;
                case 75: // k
                    this.keys.backward = false;
                    break;
                case 76: // l
                    this.keys.right = false;
                    break;
                case 79: // o
                    this.keys.action = false;
                break;
            }
        }

        if(this.noPlayer == 4){
            switch (event.keyCode) {
                case 104: // 8
                    this.keys.forward = false;
                    break;
                case 100: // 4
                    this.keys.left = false;
                    break;
                case 101: // 5
                    this.keys.backward = false;
                    break;
                case 102: // 6
                    this.keys.right = false;
                    break;
                case 105: // 9
                    this.keys.action = false;
                    break;
            }
        }
    }
};