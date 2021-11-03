import { Vector3 } from "three";
import { Model3D } from "./model3d";
import * as THREE from "three";
import { Point3D } from "./parametric-surface";
import { ParametricCurve } from "./parametric-curve";

//line made of strights segments
export class LineModel3D extends Model3D {

    public static createFromParametricCurve(fn: (t: number) => Point3D,
        mint: number, maxt: number, deltat: number, color: THREE.ColorRepresentation): LineModel3D {
        return new LineModel3D((new ParametricCurve(fn, mint, maxt, deltat)).createGeometry(), color);
    }

    public static createLineFromParametricCurve(fn: (t: number) => Point3D, 
    mint: number, maxt: number, deltat: number, color: THREE.ColorRepresentation):THREE.Line
    {
        const g = new THREE.BufferGeometry();
        g.setFromPoints((new ParametricCurve(fn,mint,maxt,deltat)).createGeometry());
        return new THREE.Line(g,new THREE.LineBasicMaterial({ color: color }));
    }

    public static createLineFromPoints(points:Point3D[],color:THREE.ColorRepresentation):THREE.Line
    {
        const g = new THREE.BufferGeometry();
        g.setFromPoints(points.map(p=>new THREE.Vector3(p.x,p.y,p.z)));
        return new THREE.Line(g,new THREE.LineBasicMaterial({ color: color }));                
    }

    private line!: THREE.Line;
    private points?: THREE.Points;
    private _visible=true;
    
    public constructor(private readonly linePoints: Array<Vector3>,
        public readonly lineColor: THREE.ColorRepresentation,
        public readonly showPoints = false, public readonly pointsColor: THREE.ColorRepresentation | undefined = undefined, private readonly pointSize = 0.1
    ) {

        super(undefined, new THREE.LineBasicMaterial({ color: lineColor }));
        if (!this.pointsColor) {
            this.pointsColor = this.lineColor;
        }
        if (this.linePoints && this.linePoints.length) {
            this.line = new THREE.Line(this.buildGeometry(), this.material);
            if (this.showPoints) {
                this.points=this.createPoints();
            }
        }
    }

    private buildGeometry(): THREE.BufferGeometry {
        const g = new THREE.BufferGeometry();
        g.setFromPoints(this.linePoints);
        return g;
    }

    private createPoints(): THREE.Points {
        const vertices: number[] = [];
        this.linePoints.forEach(p => {
            vertices.push(p.x);
            vertices.push(p.y);
            vertices.push(p.z);
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial({ color: this.pointsColor,size:this.pointSize });
        return new THREE.Points(geometry, material);
    }

    public setLayer(layer:number)
    {
        if (this.line)
        {
            (this.line as THREE.Object3D).layers.enable(layer);
            if (this.points)            
            {
                this.points.layers.enable(layer);
            }
        }
    }

    public disableLayer(layer:number)
    {
        if (this.line)
        {
            (this.line as THREE.Object3D).layers.disable(layer);
            if (this.points)            
            {
                this.points.layers.disable(layer);
            }
        }
    }

    public addToScene(scene: THREE.Scene): void {
        if (this.line) {
            scene.add(this.line);
            if (this.points)
            {
                scene.add(this.points);
            }
        }
        else {
            throw new Error('Line withot data');
        }
    }

    public get visible(): boolean {
       return this._visible;
    }

    public set visible(v: boolean) {
        if (this.linePoints)  
        {
            this.line.visible=v;
            if (this.points)
            {
                this.points.visible=v;
            }
            this._visible=v;
        }
    }
}