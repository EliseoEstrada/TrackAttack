import {OBJLoader, MTLLoader} from '../jsm/modules.js';

export default class LoadOBJ{

    constructor(path, objFile, mtlFile, callback){

        this.ready = false;

        var mtlLoader = new MTLLoader();
        mtlLoader.setPath(path);
        mtlLoader.load(mtlFile, (materialCargado) => {
            //Se ejecuta cuando termina de cargar el mtl
            var objLoader = new OBJLoader();
            objLoader.setPath(path);
            objLoader.setMaterials(materialCargado);
    
            objLoader.load(objFile, (objCargado) => {
                //Se ejecuta cuando termina de cargar el obj
                //onLoadCallback(objCargado);
                this.obj = objCargado;
                this.ready = true;
                callback()
            });
        });
    }

}