import { BaseMesh, Model3DMultiMesh } from "src/app/engine3d/model3dmultimesh";
import { ParametricSurface, SurfacePoint } from "src/app/engine3d/parametric-surface";
import * as THREE from "three";

export class HollowCylinder extends Model3DMultiMesh {

    private point: SurfacePoint = { x: 0, y: 0, z: 0 };
    private readonly DEG_TO_RAD=Math.PI/180;
    private readonly OPACITY=0.9;
    private readonly DELTA_ANGLE=10; //deg
    private readonly startAngle=90;
    private readonly endAngle=360;
    private cmaterial!:THREE.Material;   
    private sectionMaterial!:THREE.Material;

    public constructor(public readonly sectionAngle: number = 0, public readonly de: number, public readonly di: number, public readonly length: number, private color: THREE.ColorRepresentation,private sectionColor:THREE.ColorRepresentation) {
        super();
        this.cmaterial=new THREE.MeshPhongMaterial( {color:color,side: THREE.DoubleSide,wireframe:false,opacity:this.OPACITY,transparent:true});      
        this.sectionMaterial=new THREE.MeshPhongMaterial( {color:sectionColor,side: THREE.DoubleSide,wireframe:false,opacity:1,transparent:false});      
        const extMesh = new BaseMesh(this.createCylinderSurface(this.de,true), this.cmaterial);
        this.addMesh("external", extMesh);     
        const intMesh = new BaseMesh(this.createCylinderSurface(this.di,false),  this.cmaterial);
        this.addMesh("internal", intMesh);    
        const sideMesh1=new BaseMesh(this.createSideGeometry(0,false),this.cmaterial);
        this.addMesh("side1",sideMesh1);   
        const sideMesh2=new BaseMesh(this.createSideGeometry(length,true),this.cmaterial);
        this.addMesh("side2",sideMesh2); 
        const sectionMesh1=new BaseMesh(this.createSectionGeometry(this.startAngle),this.sectionMaterial);
        this.addMesh("section1",sectionMesh1); 
        const sectionMesh2=new BaseMesh(this.createSectionGeometry(this.endAngle),this.sectionMaterial);
        this.addMesh("section2",sectionMesh2);                       
    }

    private createCylinderSurface(diameter:number,external:boolean): THREE.BufferGeometry {
      
        const deltau = this.DELTA_ANGLE;
        const deltav=this.length;
        
        const psurface = new ParametricSurface((u: number, v: number) => { return this.getSurfacePoint(u, v,diameter) },
             (u: number, v: number) => {
                 return this.getSurfaceNormal(u,v,external);
             }
             , deltau, deltav, this.startAngle,this.endAngle, 0, this.length);    

        return psurface.createGeometry()
    }    

    public addToScene(scene: THREE.Scene): void {
       super.addToScene(scene);     
    }  

    /**
     * u=theta
     * @param u 
     * @param v 
     */
    private getSurfacePoint(u: number, v: number, d: number): SurfacePoint {
        u=u*this.DEG_TO_RAD;
        const r = d / 2;
        this.point.x = r * Math.cos(u);
        this.point.y = r * Math.sin(u);
        this.point.z = v;
        return this.point;
    }

    private getSurfaceNormal(u: number, v: number, externalCyl: boolean): SurfacePoint {
        u=u*this.DEG_TO_RAD;
        this.point.x = Math.cos(u);        
        this.point.y =-Math.sin(u);
        this.point.z = 0;
        if (!externalCyl) {
            this.point.x = this.point.x;
            this.point.y = this.point.y;
        }
        return this.point;

    }

    private getSidePoint(theta:number,r:number,z:number):SurfacePoint
    {
        theta=theta*this.DEG_TO_RAD;
        this.point.x=r*Math.cos(theta);
        this.point.y=r*Math.sin(theta);
        this.point.z=z;    
        return this.point;    
    }

    private getSectionPoint(z:number,r:number,angle:number):SurfacePoint
    {
        angle=angle*this.DEG_TO_RAD;
        this.point.x=r*Math.cos(angle);
        this.point.y=r*Math.sin(angle);
        this.point.z=z;
        return this.point;
    }

    private getSectionNormal(angle:number)
    {
        angle=angle*this.DEG_TO_RAD;
        this.point.x=Math.sin(angle);
        this.point.y=Math.cos(angle);
        this.point.z=0;
        return this.point;
    }

    private createSideGeometry(z:number,normalPositiveZ:boolean):THREE.BufferGeometry
    {
        const n:number=normalPositiveZ ? 1:-1;
        const minv=this.di/2;
        const maxv=this.de/2;
        const deltav=maxv-minv;
        const psurface = new ParametricSurface((u: number, v: number) => { return this.getSidePoint(u, v,z) },
        (u: number, v: number) => {
            this.point.x=0;
            this.point.y=0;
            this.point.z=n;
            return this.point;
        }
        , this.DELTA_ANGLE,deltav, this.startAngle,this.endAngle,minv,maxv);       
        return psurface.createGeometry();                
    }

    private createSectionGeometry(angle:number):THREE.BufferGeometry
    {
        const minv=this.di/2;
        const maxv=this.de/2;
        const deltav=maxv-minv;
        const psurface = new ParametricSurface((u: number, v: number) => { return this.getSectionPoint(u, v,angle) },
        (u: number, v: number) => {
            return this.getSectionNormal(angle);
        }
        , this.length,deltav, 0,this.length,minv,maxv);       
        return psurface.createGeometry();      
    }
}