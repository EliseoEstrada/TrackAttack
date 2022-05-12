import * as THREE from 'three'

export default class Puzzle01{
    constructor(posX, posY, posZ, rotY, posX2, posY2, posZ2, lever, wall, puzzlesCollitions, DEV){
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
        this.velocity = 1;
        this.endPosition = posY - 65;

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

        puzzlesCollitions.push(this.boxCollition2);
    }

    update(playerCollition, puzzlesCollitions){

        if(this.boxCollition.intersectsBox(playerCollition)){
            
            this.obj2.position.y -= this.velocity;

            if(this.obj2.position.y < this.endPosition){
                this.complete = true;
                this.obj2.visible = false;
                this.box2.visible = false;

                //Eliminar colision de arreglo
                var index = puzzlesCollitions.indexOf(this.boxCollition2);
                if (index > -1) {
                    puzzlesCollitions.splice(index, 1);
                }

            }
        }
  
    }



    renderer(scene){
        scene.add(this.obj);
        scene.add(this.obj2);
        scene.add(this.box);
        scene.add(this.box2);
    }



}