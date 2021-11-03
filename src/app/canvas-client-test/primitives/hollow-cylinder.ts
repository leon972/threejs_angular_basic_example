import { LineModel3D } from "src/app/engine3d/linemodel";
import { BaseMesh, Model3DMultiMesh } from "src/app/engine3d/model3dmultimesh";
import { ParametricSurface, Point3D } from "src/app/engine3d/parametric-surface";
import * as THREE from "three";

export class HollowCylinder extends Model3DMultiMesh {

    private point: Point3D = { x: 0, y: 0, z: 0 };
    private readonly DEG_TO_RAD = Math.PI / 180;
    private readonly OPACITY = 0.9;
    private readonly DELTA_ANGLE = 10; //deg
    private readonly startAngle = 90;
    private readonly endAngle = 360;
    private readonly WIREFRAME_SURFACE_ANGLE_STEP=30;
    private cmaterial!: THREE.Material;
    private sectionMaterial!: THREE.Material;
    private wireframe: THREE.Line[] = [];
    private _visible1 = true;

    public constructor(public readonly sectionAngle: number = 0, public readonly de: number, public readonly di: number,
        public readonly length: number,
        private color: THREE.ColorRepresentation, private sectionColor: THREE.ColorRepresentation, private edgeColor: THREE.ColorRepresentation,
        private sectionEdgeColor: THREE.ColorRepresentation) {
        super();
        this.cmaterial = new THREE.MeshPhongMaterial({ color: color, side: THREE.DoubleSide, wireframe: false, opacity: this.OPACITY, transparent: true });
        this.sectionMaterial = new THREE.MeshPhongMaterial({ color: sectionColor, side: THREE.DoubleSide, wireframe: false, opacity: 1, transparent: false });
        const extMesh = new BaseMesh(this.createCylinderSurface(this.de, true), this.cmaterial);
        this.addMesh("external", extMesh);
        const intMesh = new BaseMesh(this.createCylinderSurface(this.di, false), this.cmaterial);
        this.addMesh("internal", intMesh);
        const sideMesh1 = new BaseMesh(this.createSideGeometry(0, false), this.cmaterial);
        this.addMesh("side1", sideMesh1);
        const sideMesh2 = new BaseMesh(this.createSideGeometry(length, true), this.cmaterial);
        this.addMesh("side2", sideMesh2);
        const sectionMesh1 = new BaseMesh(this.createSectionGeometry(this.startAngle), this.sectionMaterial);
        this.addMesh("section1", sectionMesh1);
        const sectionMesh2 = new BaseMesh(this.createSectionGeometry(this.endAngle), this.sectionMaterial);
        this.addMesh("section2", sectionMesh2);
        this.createWireframe();

        this.showSolid(true);
    }

    public set visible(v: boolean) {
        super.visible = v;
        this.wireframe.forEach(w => w.visible = v);
        this._visible1 = v;
    }

    public get visible(): boolean {
        return this._visible1;
    }

    public showSolid(showSolid: boolean): void {
        this.meshes.forEach(m => m.setEnabled(showSolid));
    }

    public showWireFrame(showWireFrame: boolean): void {
        this.wireframe.forEach(w => w.visible = showWireFrame);
    }

    private createCylinderSurface(diameter: number, external: boolean): THREE.BufferGeometry {

        const deltau = this.DELTA_ANGLE;
        const deltav = this.length;

        const psurface = new ParametricSurface((u: number, v: number) => { return this.getSurfacePoint(u, v, diameter) },
            (u: number, v: number) => {
                return this.getSurfaceNormal(u, v, external);
            }
            , deltau, deltav, this.startAngle, this.endAngle, 0, this.length);

        return psurface.createGeometry()
    }

    public addToScene(scene: THREE.Scene): void {
        super.addToScene(scene);
        this.wireframe.forEach(w => {
            scene.add(w);
        })
    }

    public setPosition(x: number | undefined = undefined, y: number | undefined = undefined, z: number | undefined = undefined): void {
        super.setPosition(x, y, z);
        this.wireframe.forEach(w => {
            if (x !== undefined) {
                w.position.x = x;
            }
            if (y !== undefined) {
                w.position.y = y;
            }
            if (z !== undefined) {
                w.position.z = z;
            }
        })
    }

    public incPosition(dx: number | undefined, dy: number | undefined, dz: number | undefined): void {
        super.incPosition(dx, dy, dz);
        this.wireframe.forEach(w => {
            if (dx !== undefined) {
                w.position.x += dx;
            }
            if (dy !== undefined) {
                w.position.y += dy;
            }
            if (dz !== undefined) {
                w.position.z += dz;
            }
        })
    }   

    /**
     * u=theta
     * @param u 
     * @param v 
     */
    private getSurfacePoint(u: number, v: number, d: number): Point3D {
        u = u * this.DEG_TO_RAD;
        const r = d / 2;
        this.point.x = r * Math.cos(u);
        this.point.y = r * Math.sin(u);
        this.point.z = v;
        return this.point;
    }

    private getSurfaceNormal(u: number, v: number, externalCyl: boolean): Point3D {
        u = u * this.DEG_TO_RAD;
        this.point.x = Math.cos(u);
        this.point.y = -Math.sin(u);
        this.point.z = 0;
        if (!externalCyl) {
            this.point.x = this.point.x;
            this.point.y = this.point.y;
        }
        return this.point;

    }

    private getSidePoint(theta: number, r: number, z: number): Point3D {
        theta = theta * this.DEG_TO_RAD;
        this.point.x = r * Math.cos(theta);
        this.point.y = r * Math.sin(theta);
        this.point.z = z;
        return this.point;
    }

    private getSectionPoint(z: number, r: number, angle: number): Point3D {
        angle = angle * this.DEG_TO_RAD;
        this.point.x = r * Math.cos(angle);
        this.point.y = r * Math.sin(angle);
        this.point.z = z;
        return this.point;
    }

    private createSectionPoint(z: number, r: number, angle: number): Point3D {
        const point={} as Point3D
        angle = angle * this.DEG_TO_RAD;
        point.x = r * Math.cos(angle);
        point.y = r * Math.sin(angle);
        point.z = z;
        return point;
    }

    private getSectionNormal(angle: number) {
        angle = angle * this.DEG_TO_RAD;
        this.point.x = Math.sin(angle);
        this.point.y = Math.cos(angle);
        this.point.z = 0;
        return this.point;
    }

    private createSideGeometry(z: number, normalPositiveZ: boolean): THREE.BufferGeometry {
        const n: number = normalPositiveZ ? 1 : -1;
        const minv = this.di / 2;
        const maxv = this.de / 2;
        const deltav = maxv - minv;
        const psurface = new ParametricSurface((u: number, v: number) => { return this.getSidePoint(u, v, z) },
            (u: number, v: number) => {
                this.point.x = 0;
                this.point.y = 0;
                this.point.z = n;
                return this.point;
            }
            , this.DELTA_ANGLE, deltav, this.startAngle, this.endAngle, minv, maxv);
        return psurface.createGeometry();
    }

    private createSectionGeometry(angle: number): THREE.BufferGeometry {
        const minv = this.di / 2;
        const maxv = this.de / 2;
        const deltav = maxv - minv;
        const psurface = new ParametricSurface((u: number, v: number) => { return this.getSectionPoint(u, v, angle) },
            (u: number, v: number) => {
                return this.getSectionNormal(angle);
            }
            , this.length, deltav, 0, this.length, minv, maxv);
        return psurface.createGeometry();
    }

    private createRoundEdge(z: number, r: number): THREE.Line {
        return LineModel3D.createLineFromParametricCurve((t: number) => {
            return this.getSidePoint(t, r, z);
        }, this.startAngle, this.endAngle, this.DELTA_ANGLE, this.edgeColor);
    }

    private createWireframe(): void {
        const ri = this.di / 2;
        const re = this.de / 2;
        this.wireframe.push(this.createRoundEdge(0, ri));
        this.wireframe.push(this.createRoundEdge(0, re));
        this.wireframe.push(this.createRoundEdge(this.length, ri));
        this.wireframe.push(this.createRoundEdge(this.length, re));
        //sections
        this.wireframe.push(LineModel3D.createLineFromPoints(
            [this.createSectionPoint(0,ri,this.startAngle),
                this.createSectionPoint(0,re,this.startAngle),
                this.createSectionPoint(this.length,re,this.startAngle),
                this.createSectionPoint(this.length,ri,this.startAngle),
                this.createSectionPoint(0,ri,this.startAngle)],this.sectionEdgeColor)
        );
        this.wireframe.push(LineModel3D.createLineFromPoints(
            [this.createSectionPoint(0,ri,this.endAngle),
                this.createSectionPoint(0,re,this.endAngle),
                this.createSectionPoint(this.length,re,this.endAngle),
                this.createSectionPoint(this.length,ri,this.endAngle),
                this.createSectionPoint(0,ri,this.endAngle)],this.sectionEdgeColor)
        );
        //external surface
        this.addWireframeSourface(re);
        this.addWireframeSourface(ri);
    }

    private addWireframeSourface(r:number)
    {        
        const step=this.WIREFRAME_SURFACE_ANGLE_STEP;
     
        for (let a=this.startAngle+step;a<=this.endAngle-step;a+=step)
        {
            this.wireframe.push(LineModel3D.createLineFromPoints([this.createSectionPoint(0,r,a),this.createSectionPoint(this.length,r,a)],this.edgeColor));
        }
    }
}