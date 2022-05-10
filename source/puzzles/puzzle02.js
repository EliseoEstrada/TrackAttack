import * as THREE from 'three';
//import { Vector3 } from '../../build/three.module';

export default class Puzzle02{
    constructor(posX, posY, posZ, arrayCollitions){
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;
        this.rotY = 0.0;

        this.raycaster = new THREE.Raycaster();
        this.collitionss = [
            new THREE.Vector3(1,0,0), 
            new THREE.Vector3(-1,0,0), 
            new THREE.Vector3(0,0,1), 
            new THREE.Vector3(0,0,-1),
            new THREE.Vector3(0,1,0),
            new THREE.Vector3(0,-1,0)
        ];

        this.complete = false;

        var red = new THREE.MeshLambertMaterial({ color: new THREE.Color(0.5, 0.0, 0.0) });
        
        var transparentMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(1.0, 1.0, 1.0),
            opacity: 0.5,
            transparent: true
        });
    

        var geometry = new THREE.BoxGeometry(50, 5, 200);
        this.obj = new THREE.Mesh(geometry, red);

        var geometry2 = new THREE.BoxGeometry(400,5,200);
        this.obj2 = new THREE.Mesh(geometry2, transparentMaterial);
        this.obj2.position.set(this.posX,this.posY, this.posZ);

        
        this.obj.position.set(this.posX, this.posY, this.posZ);

        arrayCollitions.push(this.obj)
        arrayCollitions.push(this.obj2)
    }

    collition(playerPosX, playerPosY, playerPosZ, player){
        this.rotY += 0.2;
        this.obj.rotation.y = THREE.MathUtils.degToRad(-this.rotY);

        for(var i = 0; i < this.collitionss.length; i++){



            var ray = this.collitionss[i];
            var posplayer = new THREE.Vector3(this.posX, this.posY, this.posZ)
            this.raycaster.set(posplayer, ray);

            var colicion = this.raycaster.intersectObjects(player, true);

            if(colicion.length > 0 && colicion[0].distance < 2){

                console.log("Arriba")

            }
        }
        
        /*
        if(playerPosZ < this.posZ + 20 && playerPosZ > this.posZ - 20){
            if(playerPosX < this.posX + 20 && playerPosX > this.posX - 20){
                
                console.log("presiono")
                this.object2.position.y -= 0.2;

                if(this.object2.position.y < -67){
                    this.complete = true;
                    console.log("puzzle 2 completado")
                }
    
            }
        }
        */

    }



    renderer(scenes){
        this.rotY += 0.2;
        this.obj.rotation.y = THREE.MathUtils.degToRad(-this.rotY);
        /*for(var i = 0; i < scenes.length; i++){
            scenes[0].add(this.object);
        }*/
        scenes[0].add(this.obj);

        scenes[0].add(this.obj2);
        //scenes[1].add(obj);
    }



}