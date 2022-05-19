import * as THREE from 'three'

export default class Puzzle03{
    constructor(posX, posY, posZ, box, top, key, bomb, wall, puzzlesCollitions, COOP, DIFFICULTY, DEV){
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;

        this.complete = false;
        this.surprisesBoxes = [];

        this.dev = DEV;
        
        this.coop = COOP;
        var difficulty = DIFFICULTY;
        var boxesCount = 6;
        var positions = [];

        if(difficulty == 1){
            boxesCount = 4;

            positions.push(new THREE.Vector3(posX -80, posY, posZ - 50));
            positions.push(new THREE.Vector3(posX  + 80, posY, posZ - 50));
            positions.push(new THREE.Vector3(posX - 80, posY, posZ + 50 ));
            positions.push(new THREE.Vector3(posX + 80, posY, posZ + 50));
        }
        if(difficulty == 2){
            boxesCount = 9;

            positions.push(new THREE.Vector3(posX -100, posY, posZ - 70));
            positions.push(new THREE.Vector3(posX, posY, posZ - 70));
            positions.push(new THREE.Vector3(posX  + 100, posY, posZ - 70));
            positions.push(new THREE.Vector3(posX -100, posY, posZ ));
            positions.push(new THREE.Vector3(posX , posY, posZ));
            positions.push(new THREE.Vector3(posX + 100, posY, posZ ));
            positions.push(new THREE.Vector3(posX - 100, posY, posZ + 70 ));
            positions.push(new THREE.Vector3(posX, posY, posZ  + 70));
            positions.push(new THREE.Vector3(posX + 100, posY, posZ + 70));
            
        }

        var random = Math.floor(Math.random() * ((boxesCount - 1) - 0)) + 0;

        for(var i = 0; i < boxesCount; i++){
            var keyBomb;
            var isKey = false;
            if(i == random){
                keyBomb = key;
                isKey = true;
            }else{
                keyBomb = bomb;
            }

            var surpriseBox = new SurpriseBox(
                positions[i].x, 
                positions[i].y, 
                positions[i].z, 
                box,
                top,
                keyBomb,
                isKey,
                this.dev
            );
            
            this.surprisesBoxes.push(surpriseBox);

        }

        //COLISION DE MUROI
        this.wall = wall.clone();
        this.wall.position.set(this.posX, this.posY, this.posZ - 180);

        var opacity = (this.dev) ? 0.3 : 0.0 ;
        var transparentMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0.0, 0.5, 0.0),
            opacity: opacity,
            transparent: true
        });

        var geometry = new THREE.BoxGeometry(400,100,80);
        //Colision
        this.box = new THREE.Mesh(geometry, transparentMaterial);
        this.box.position.set(this.posX, this.posY, this.posZ - 180);
        this.boxCollition = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.boxCollition.setFromObject(this.box);

        puzzlesCollitions.push(this.boxCollition)
    }

    update(playerCollition, playerAction, player, player2Collition, player2Action, player2){
        this.surprisesBoxes.forEach(element => {
            if(!element.isOpen){
                var stun = element.update(playerCollition, playerAction);

                if(!player.stunned && stun){
                    player.stunned = true;
                }
                if(this.coop){

                    stun = element.update(player2Collition, player2Action);                

                    if(!player2.stunned && stun){
                        player2.stunned = true;
                    }
                }
            }

            if(element.isKey && element.isOpen){
                this.complete = true;
            }
        });
        
    }


    renderer(scene){

        this.surprisesBoxes.forEach(element => {
            element.render(scene);
        });

        scene.add(this.wall);
        if(this.dev && !this.complete){
            scene.add(this.box);
        }
    }

    finishPuzzle(scene, puzzlesCollitions){
        scene.remove(this.wall);
        if(this.dev){
            scene.remove(this.box);
        }
        //Eliminar colision de arreglo
        var index = puzzlesCollitions.indexOf(this.boxCollition);
        if (index > -1) {
            puzzlesCollitions.splice(index, 1);
        }
    }
}



class SurpriseBox{
    constructor(posX, posY, posZ, box, top, keyBomb, isKey, DEV){
        this.isKey = isKey;
        this.isOpen = false;

        this.surpriseModel = keyBomb.clone();
        this.topModel = top.clone();
        this.boxModel = box.clone();

        this.surpriseModel.position.set(posX, posY + 15, posZ);
        this.boxModel.position.set(posX, posY, posZ);
        this.topModel.position.set(posX, posY, posZ);

        
        var opacity = (DEV) ? 0.3 : 0.0 ;
        var transparentMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0.0, 0.5, 0.0),
            opacity: opacity,
            transparent: true
        });

        var geometry = new THREE.BoxGeometry(50,50,50);
        //Colision
        this.box = new THREE.Mesh(geometry, transparentMaterial);
        this.box.position.set(posX, posY, posZ);
        this.boxCollition = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.boxCollition.setFromObject(this.box);
    }

    update(playerCollition, playerAction){
        var stun = false;
        if(this.boxCollition.intersectsBox(playerCollition) && (playerAction)){
            this.topModel.position.y += 40;
            this.topModel.position.z += 20;
            this.topModel.rotation.x = THREE.Math.degToRad(-90);

            this.surpriseModel.position.y += 40;
            this.isOpen = true;

            if(!this.isKey){
                stun = true;
            }
        }
        return stun;

    }


    render(scene){
        scene.add(this.boxModel);
        scene.add(this.box);
        scene.add(this.topModel);
        scene.add(this.surpriseModel);
    }
}