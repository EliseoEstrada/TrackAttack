import * as THREE from '../build/three.module.js';


export default class Camera{
    constructor(posX, posY, posZ, visibleSize, cameras, isCoop){
        
        this.isCoop = isCoop;
        
        this.camera = new THREE.PerspectiveCamera(
            35, 
            visibleSize.width / visibleSize.height,
            0.1, 
            10000
        );
    
        
        this.camera.position.x = posX;
        this.camera.position.y = posY;
        this.camera.position.z = posZ;
        this.camera.rotation.x = THREE.Math.degToRad(-40);
    
        cameras.push(this.camera)
    }

    move(posX1, posZ1, posX2, posZ2){
        if(!this.isCoop){
            this.camera.position.z = posZ1 + 300;
        }else{
            /*
            var distance = Math.pow((posX2 - posX1), 2) + Math.pow((posZ2 - posZ1), 2)
            var posZ = Math.sqrt(distance)

            this.camera.position.z = posZ + 300
*/
            this.camera.position.z = posZ1 + 300;
        }
    }

}
