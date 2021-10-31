import { Model3D } from "./model3d";
import * as THREE from "three";

export class SimpleCube extends Model3D
{
    public constructor(sidex:number,sidey:number,sidez:number,color:THREE.Color)
    {
        super(new THREE.BoxGeometry(sidex,sidey,sidez),new THREE.MeshBasicMaterial({color}));       
    }
}