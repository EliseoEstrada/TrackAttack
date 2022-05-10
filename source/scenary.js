import {OBJLoader, MTLLoader} from '../jsm/modules.js';

export default class Scenary{

    constructor(path, objFile, mtlFile, scale){
        this.path = path;
        this.objFile = objFile;
        this.mtlFile = mtlFile;
        this.objCargado;
        this.scale= scale
    }

    renderer(posX, posY, posZ, scene1, scene2){
        var mtlLoader = new MTLLoader();
        mtlLoader.setPath(this.path);
        mtlLoader.load(this.mtlFile, (materialCargado) => {
            //Se ejecuta cuando termina de cargar el mtl
            var objLoader = new OBJLoader();
            objLoader.setPath(this.path);
            objLoader.setMaterials(materialCargado);
    
            objLoader.load(this.objFile, (objCargado) => {
                //Se ejecuta cuando termina de cargar el obj
                //onLoadCallback(objCargado);

                objCargado.position.set(posX, posY, posZ);
                objCargado.scale.set(this.scale,this.scale,this.scale);
                var objCargado02 = objCargado.clone();
                scene1.add(objCargado);
                scene2.add(objCargado02);
            });
        });
    }

}