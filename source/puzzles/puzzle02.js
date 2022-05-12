import * as THREE from 'three'

export default class Puzzle02{
    constructor(posX, posY, posZ, rotY, posX2, posY2, posZ2, bridge, button, puzzlesCollitions, DEV){
        //Posicion de la palanca
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;

        this.rotY = rotY;

        //Posicion de botones
        this.posX2 = posX2;
        this.posY2 = posY2;
        this.posZ2 = posZ2;

        this.complete = false;
        this.rotationVelocity = 1.0;
        this.degrees = rotY;
        this.up = false;

        this.obj = bridge;
        this.obj.position.set(posX, posY, posZ);
        this.obj.rotation.y = THREE.Math.degToRad(this.degrees);
        this.obj.scale.z = 1.5;

        this.button1 = button;
        this.button1.position.set(posX - 150, posY, posZ + 110);

        this.button2 = this.button1.clone();
        this.button2.position.set(posX + 150, posY, posZ - 110);

        var opacity = (DEV) ? 0.5 : 0.0 ;
        var transparentMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0.0, 0.5, 0.0),
            opacity: opacity,
            transparent: true
        });

        var geometry = new THREE.BoxGeometry(60,30,10);

        //Colisiones de puente
        this.box = new THREE.Mesh(geometry, transparentMaterial);
        this.box.position.set(posX, posY, posZ + 70);
        this.boxCollition = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.boxCollition.setFromObject(this.box);

        this.box2 = new THREE.Mesh(geometry, transparentMaterial);
        this.box2.position.set(posX, posY, posZ - 70);
        this.boxCollition2 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.boxCollition2.setFromObject(this.box2);

        var geometry2 = new THREE.BoxGeometry(30,30,140);
        this.box3 = new THREE.Mesh(geometry2, transparentMaterial);
        this.box3.position.set(posX + 50, posY, posZ);
        this.boxCollition3 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.boxCollition3.setFromObject(this.box3);

        this.box4 = new THREE.Mesh(geometry2, transparentMaterial);
        this.box4.position.set(posX - 50, posY, posZ);
        this.boxCollition4 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.boxCollition4.setFromObject(this.box4);

        //Triggers de botones
        var geometry3 = new THREE.BoxGeometry(50,50,50);
        this.box5 = new THREE.Mesh(geometry3, transparentMaterial);
        this.box5.position.set(this.button1.position.x, this.button1.position.y, this.button1.position.z);
        this.boxCollition5 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.boxCollition5.setFromObject(this.box5);

        this.box6 = new THREE.Mesh(geometry3, transparentMaterial);
        this.box6.position.set(this.button2.position.x, this.button2.position.y, this.button2.position.z);
        this.boxCollition6 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.boxCollition6.setFromObject(this.box6);

        //Trigger final
        var geometry4 = new THREE.BoxGeometry(450,80,20);
        this.boxFinal = new THREE.Mesh(geometry4, transparentMaterial);
        this.boxFinal.position.set(posX, posY, posZ - 200);
        this.boxCollitionF = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.boxCollitionF.setFromObject(this.boxFinal);

        puzzlesCollitions.push(this.boxCollition);
        puzzlesCollitions.push(this.boxCollition2);
        puzzlesCollitions.push(this.boxCollition3);
        puzzlesCollitions.push(this.boxCollition4);
    }

    update(player1Collition, player1Action, player2Collition, player2Action){
        
        if(this.boxCollitionF.intersectsBox(player1Collition) &&
            this.boxCollitionF.intersectsBox(player2Collition)){
                this.complete = true;
                return 
        }

        var buttonIspressed = false;

        if((this.boxCollition5.intersectsBox(player1Collition) && (player1Action)) ||
            (this.boxCollition6.intersectsBox(player1Collition) && (player1Action))){
                buttonIspressed = true;
        }

        if((this.boxCollition5.intersectsBox(player2Collition) && (player2Action)) ||
            (this.boxCollition6.intersectsBox(player2Collition) && (player2Action))){
                buttonIspressed = true;
        }

        if(!buttonIspressed){
            this.obj.rotation.y = THREE.Math.degToRad(this.degrees);

            this.degrees += this.rotationVelocity;
            if(this.degrees > 360){
                this.degrees = 0;
            }
        }


        if(this.isInRange()){
            if(!this.up){
                
                this.box.position.y = this.box.position.y + 150.0;
                this.box2.position.y = this.box2.position.y + 150.0;
                this.boxCollition.setFromObject(this.box);
                this.boxCollition2.setFromObject(this.box2);
                this.up = true;
            }
        }else{
            if(this.up){
                
                this.box.position.y = this.box.position.y - 150.0;
                this.box2.position.y = this.box2.position.y - 150.0;
                this.boxCollition.setFromObject(this.box);
                this.boxCollition2.setFromObject(this.box2);
                this.up = false;
            }
        }

    }

    isInRange(){
        switch((this.degrees > 60.0 && this.degrees < 120.0) ||
                (this.degrees > 240.0 && this.degrees < 300.0) ){
            case true:
                return true;
              default:
                return false;
        }
    }



    renderer(scene){
        scene.add(this.obj);
        scene.add(this.box);
        scene.add(this.box2);
        scene.add(this.box3);
        scene.add(this.box4);
        scene.add(this.box5);
        scene.add(this.box6);
        scene.add(this.boxFinal);
        scene.add(this.button1);
        scene.add(this.button2);
    }



}