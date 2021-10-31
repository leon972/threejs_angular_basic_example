import { Model3D } from "./model3d";
import * as THREE from "three";

export const MaterialUtils =
{
    /**
     * 
     * @param color Base material not affected by light
     * @returns 
     */
    createSimpleMaterial(color: THREE.ColorRepresentation): THREE.Material {
        return new THREE.MeshBasicMaterial({ color });
    },

    createPhongMaterial(color: THREE.ColorRepresentation): THREE.Material {
        return new THREE.MeshPhongMaterial({ color });
    }

};

export const ObjectsUtils =
{
    crateWireframeMesh(geometry: THREE.BufferGeometry, color: THREE.ColorRepresentation, material: THREE.Material): THREE.Line {
        const wireframe = new THREE.WireframeGeometry(geometry);
        const line = new THREE.LineSegments( wireframe );   
        line.material=material        
        const m:THREE.Material=line.material as THREE.Material;    
        m.depthTest = false;        
        m.opacity = 0.25;
        m.transparent = true;
        return line;
    }
}
export class SimpleCube extends Model3D {
    public constructor(sidex: number, sidey: number, sidez: number, material: THREE.Material) {
        super(new THREE.BoxGeometry(sidex, sidey, sidez), material);
    }
}

