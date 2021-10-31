import * as THREE from "three";
import { BufferGeometry, Scene } from "three";
import { Model3D } from "./model3d";

export interface GeneralMesh {
    addToScene(scene: THREE.Scene): void;
    setEnabled(enabled: boolean): void;
    getEnabled(): boolean;
    getObject3D(): THREE.Object3D;
}

export class BaseMesh implements GeneralMesh {
    private enabled = true;
    private mesh!: THREE.Mesh;
    public constructor(public readonly geometry: THREE.BufferGeometry, public readonly material: THREE.Material) {
        if (this.geometry && this.material) {
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            
        }
    }
    getObject3D(): THREE.Object3D {
        return this.mesh;
    }
    addToScene(scene: Scene): void {
        if (this.mesh) {
            scene.add(this.mesh);
        }
        else {
            throw new Error('Object without mesh');
        }
    }
    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
        if (this.mesh) {
            this.mesh.visible = this.enabled;
        }
    }
    getEnabled(): boolean {
        return this.enabled;
    }
}

export class WireframeMesh implements GeneralMesh {
    private enabled = true;
    private lines?: THREE.LineSegments;

    public constructor(public readonly geometry: THREE.BufferGeometry, public color:THREE.ColorRepresentation,public showMaterial: boolean, opacity:number= 1) {
        const wireframe = new THREE.EdgesGeometry(geometry);
        const mat=new THREE.LineBasicMaterial({color});
        this.lines = new THREE.LineSegments(wireframe,mat);       
        mat.opacity = opacity;
        mat.transparent = !showMaterial;

    }
    getObject3D(): THREE.Object3D {
        this.lines?.position
        return this.lines as THREE.Object3D;

    }

    addToScene(scene: THREE.Scene): void {
        if (this.lines) {
            scene.add(this.lines);
        }
    }

    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
        if (this.lines) {
            this.lines.visible = this.enabled;
        }
    }
    getEnabled(): boolean {
        return this.enabled;
    }
}

export class Model3DMultiMesh extends Model3D {

    private meshes: Array<GeneralMesh> = [];

    public constructor() {
        super(undefined, undefined);
    }

    public addMesh(mesh: GeneralMesh): GeneralMesh {
        if (mesh) {
            this.meshes.push(mesh);
        }
        return mesh;
    }

    public addToScene(scene: THREE.Scene): void {
        this.meshes.forEach(m => m.addToScene(scene));
    }

    public setPosition(x: number | undefined = undefined, y: number | undefined = undefined, z: number | undefined = undefined): void {

        this.meshes.forEach(m => {
            if (m) {
                const obj: THREE.Object3D = m.getObject3D();
                if (x !== undefined) {
                    obj.position.x = x;
                }
                if (y !== undefined) {
                    obj.position.y = y;
                }
                if (z !== undefined) {
                    obj.position.z = z;
                }
            }
        });
    }

    public setScale(x: number, y: number, z: number): void {
        this.meshes.forEach(m => {
            if (m) {
                m.getObject3D().scale.set(x, y, z);
            }
        });
    }

    public setRotation(rx: number | undefined = undefined, ry: number | undefined = undefined, rz: number | undefined = undefined) {
        this.meshes.forEach(m => {
            if (m) {
                const obj: THREE.Object3D = m.getObject3D();
                if (rx !== undefined) {
                    obj.rotation.x = rx;
                }
                if (ry !== undefined) {
                    obj.rotation.y = ry;
                }
                if (rz !== undefined) {
                    obj.rotation.z = rz;
                }
            }
        });
    }

}