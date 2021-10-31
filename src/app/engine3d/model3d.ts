import * as THREE from "three";
import { NumberKeyframeTrack, Vector3 } from "three";

export class Model3D {
    protected parent?: Model3D;
    private mesh?: THREE.Mesh;
    private layer: number = 0; //0-31
    public constructor(protected readonly geometry: THREE.BufferGeometry | undefined, protected readonly material: THREE.Material | undefined) {
        this.createMesh();
    }

    public get visible(): boolean {
        return !!this.mesh && this.mesh.visible;
    }

    public set visible(v: boolean) {
        if (this.mesh) {
            this.mesh.visible = v;
        }
    }

    public setParent(parent: Model3D | undefined): void {
        this.parent = parent;
    }

    public getParent(): Model3D | undefined {
        return this.parent;
    }

    private createMesh(): void {
        if (this.geometry && this.material) {
            this.mesh = new THREE.Mesh(this.geometry, this.material);
        }
    }

    public getMesh(): THREE.Mesh | undefined {
        return this.mesh;
    }

    public getObject3D(): THREE.Object3D | undefined {
        return this.mesh;
    }

    public setPosition(x: number | undefined = undefined, y: number | undefined = undefined, z: number | undefined = undefined): void {

        if (this.mesh) {
            if (x !== undefined) {
                this.mesh.position.x = x;
            }
            if (y !== undefined) {
                this.mesh.position.y = y;
            }
            if (z !== undefined) {
                this.mesh.position.z = z;
            }
        }
    }

    public incPosition(dx:number,dy:number,dz:number):void
    {
        if (this.mesh)
        {
            if (dx !== undefined) {
                this.mesh.position.x += dx;
            }
            if (dy !== undefined) {
                this.mesh.position.y  +=dy;
            }
            if (dz !== undefined) {
                this.mesh.position.z +=dz;
            }
        }
    }

    public setScale(x: number, y: number, z: number): void {
        this.mesh?.scale.set(x, y, z);
    }

    public setRotation(rx: number | undefined = undefined, ry: number | undefined = undefined, rz: number | undefined = undefined) {
        if (this.mesh) {
            if (rx !== undefined) {
                this.mesh.rotation.x = rx;
            }
            if (ry !== undefined) {
                this.mesh.rotation.y = ry;
            }
            if (rz !== undefined) {
                this.mesh.rotation.z = rz;
            }
        }
    }

    public incRotation(drx: number | undefined = undefined, dry: number | undefined = undefined, drz: number | undefined = undefined) {
        
        if (this.mesh) {
            if (drx !== undefined) {
                this.mesh.rotation.x += drx;
            }
            if (dry !== undefined) {
                this.mesh.rotation.y += dry;
            }
            if (drz !== undefined) {
                this.mesh.rotation.z += drz;
            }
        }
        
    }


    public getLayer(): number {
        return this.layer;
    }

    public setLayer(layer: number): void {
        if (layer >= 0 && layer < 32) {
            this.layer = layer;
        }
        else {
            throw new Error('Invalid layer:' + layer);
        }
    }

    public addToScene(scene: THREE.Scene): void {
        if (this.mesh) {
            scene.add(this.mesh);
        }
        else {
            throw new Error('Object without mesh');
        }
    }

}