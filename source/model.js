import * as THREE from 'three'

export default class Model{

    constructor(posX, posY, posZ, rotY, scale, obj, scaleBoxX, scaleBoxY, scaleBoxZ, DEV){
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;
        this.rotY = rotY;
        this.scale = scale;
        this.obj = obj;

        //Modelo obj
        this.obj.position.set(this.posX, this.posY, this.posZ);
        this.obj.rotation.set(0, THREE.MathUtils.degToRad(this.rotY), 0);
        this.obj.scale.set(this.scale,this.scale,this.scale);


        //Colision
        var opacity = (DEV) ? 0.5 : 0.0 ;
        var transparentMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(1.0, 1.0, 1.0),
            opacity: opacity,
            transparent: true
        });

        var geometry = new THREE.BoxGeometry(scaleBoxX,scaleBoxY,scaleBoxZ);
        this.box = new THREE.Mesh(geometry, transparentMaterial);
        this.box.position.set(this.posX, this.posY, this.posZ);
        this.box.rotation.set(0, THREE.MathUtils.degToRad(this.rotY), 0);
        this.box.scale.set(this.scale,this.scale,this.scale);

        this.boxCollition = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.boxCollition.setFromObject(this.box);

    }

    activeCollition(collitionsModels){
        collitionsModels.push(this.boxCollition);
    }

    renderer(scenes){
        scenes[0].add(this.obj);
        scenes[0].add(this.box);
        scenes[1].add(this.obj.clone());
        scenes[1].add(this.box.clone());
    }

}