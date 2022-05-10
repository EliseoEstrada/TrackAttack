import {OBJLoader, MTLLoader} from '../jsm/modules.js';

export default class Interactive{

    constructor(posX, posY, posZ, rotX, rotY, rotZ, scale, obj, arrayCollitions, name){
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;
        this.rotX = rotX;
        this.rotY = rotY;
        this.rotZ = rotZ;
        this.scale = scale;
        this.object = obj;

        //Agregar obj al arreglo de colisiones
        arrayCollitions.push(this.object);
        
        this.object.name = name
    }



    renderer(scenes){
        this.object.position.set(this.posX, this.posY, this.posZ);
        this.object.rotation.set(this.rotX, this.rotY, this.rotZ);
        this.object.scale.set(this.scale,this.scale,this.scale);
        /*for(var i = 0; i < scenes.length; i++){
            scenes[0].add(this.object);
        }*/
        var object2 = this.object.clone();
        scenes[0].add(this.object);
        scenes[1].add(object2);
    }

}