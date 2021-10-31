import * as THREE from "three";

export abstract class Model3D {
    protected parent?: Model3D;
    private mesh?: THREE.Mesh;
    private layer:number=0; //0-31
    public constructor(protected readonly geometry: THREE.BufferGeometry, protected readonly material: THREE.Material) {
        this.createMesh();
    }

    public get visible():boolean
    {
        return !!this.mesh && this.mesh.visible;
    }

    public set visible(v:boolean)
    {
        if (this.mesh)
        {
            this.mesh.visible=v;
        }
    }

    public setParent(parent: Model3D | undefined): void {
        this.parent = parent;
    }

    public getParent(): Model3D | undefined {
        return this.parent;
    }

    private createMesh(): void {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    public getMesh(): THREE.Mesh | undefined {
        return this.mesh;
    }

    public setPosition(x: number | undefined=undefined, y: number | undefined=undefined, z: number | undefined=undefined): void {

        if (this.mesh) {
            if (x !== undefined) {
                this.mesh.position.x = x;
            }
            if (y !== undefined)
            {
                this.mesh.position.y=y;
            }
            if (z !== undefined)
            {
                this.mesh.position.z=z;
            }
        }
    }  

    public setRotation(rx:number |undefined=undefined,ry:number|undefined=undefined,rz:number|undefined=undefined)
    {
        if (this.mesh) {
            if (rx !== undefined) {
                this.mesh.rotation.x = rx;
            }
            if (ry !== undefined)
            {
                this.mesh.rotation.y=ry;
            }
            if (rz !== undefined)
            {
                this.mesh.rotation.z=rz;
            }
        }
    }
    
    public getLayer():number
    {
        return this.layer;
    }

    public setLayer(layer:number):void
    {
        if (layer>=0 && layer<32)
        {
            this.layer=layer;
        }
        else
        {
            throw new Error('Invalid layer:'+layer);
        }
    }

}