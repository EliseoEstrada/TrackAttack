import * as THREE from 'three'

export default class Puzzle01{
    constructor(posX, posY, posZ, rotY, posX2, posY2, posZ2, lever, wall, collitionsModels, DEV){
        //Posicion de la palanca
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;

        this.rotY = rotY;

        //Posicion del muro
        this.posX2 = posX2;
        this.posY2 = posY2;
        this.posZ2 = posZ2;

        this.complete = false;

        this.obj = lever;
        this.obj.position.set(posX, posY, posZ);
        this.obj.rotation.y = THREE.Math.degToRad(rotY);

        
        this.obj2 = wall;
        this.obj2.position.set(posX2, posY2, posZ2);
        this.obj2.scale.set(0.5,1,0.5);


        var opacity = (DEV) ? 0.5 : 0.0 ;
        var transparentMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0.0, 0.5, 0.0),
            opacity: opacity,
            transparent: true
        });

        var geometry = new THREE.BoxGeometry(40,70,50);
        this.box = new THREE.Mesh(geometry, transparentMaterial);
        this.box.position.set(posX, posY, posZ);
        this.boxCollition = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.boxCollition.setFromObject(this.box);

        var geometry2 = new THREE.BoxGeometry(170,200,50);
        this.box2 = new THREE.Mesh(geometry2, transparentMaterial);
        this.box2.position.set(posX2, posY2, posZ2);
        this.boxCollition2 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.boxCollition2.setFromObject(this.box2);

        collitionsModels.push(this.boxCollition2);
    }

    update(playerCollition){
        if(this.boxCollition.intersectsBox(playerCollition)){
            console.log("en puzzle");
        }
    }

    collition(playerPosX, playerPosZ, action){

        if(playerPosZ < this.posZ + 20 && playerPosZ > this.posZ - 20){
            if(playerPosX < this.posX + 20 && playerPosX > this.posX - 20){
                
                console.log("presiono")
                this.object2.position.y -= 0.2;

                if(this.object2.position.y < -67){
                    this.complete = true;
                    console.log("puzzle completado")
                }
    
            }
        }

    }



    renderer(scenes){
        scenes[0].add(this.obj);
        scenes[0].add(this.obj2);
        scenes[0].add(this.box);
        scenes[0].add(this.box2);
        scenes[1].add(this.obj.clone());
        scenes[1].add(this.obj2.clone());
        scenes[1].add(this.box.clone());
        scenes[1].add(this.box2.clone());
    }



}