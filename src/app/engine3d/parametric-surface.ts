import { Vector3 } from "three";
import * as THREE from "three";

export interface SurfacePoint
{
    x:number;
    y:number;
    z:number;
}

export class ParametricSurface {

    /**    
     * @param fn parametric function: return an array of three element x,y,z
     * @param deltau 
     * @param deltav 
     * @param minu 
     * @param maxu 
     * @param minv 
     * @param maxv 
     */
    public constructor(private readonly fn: (u: number, v: number) => SurfacePoint,private readonly fnNormal:(u:number,v:number)=>SurfacePoint,
        private readonly deltau: number, private readonly deltav: number, private readonly minu: number,
        private readonly maxu: number, private readonly minv: number, private readonly maxv: number) {

    }

    public createGeometry(): THREE.BufferGeometry {

        const geometry = new THREE.BufferGeometry();
        const indices: number[] = [];
        const vertices: number[] = [];
        const normals: number[] = [];
        let line1: SurfacePoint[] = [];
        let line2: SurfacePoint[] = [];
        let iu=0;
        let iv=0;

        for (let v = this.minv; v < this.maxv; v += this.deltav) {

            if (line1.length==0)
            {
                line1=this.getLineOfPoints(v);
                this.pushVertexArray(line1,vertices);
                this.pushVertexArray(this.getNormals(v),normals);
            }
            else
            {
                line1=line2;
            }
            
            line2=this.getLineOfPoints(v+this.deltav);
            this.pushVertexArray(line2,vertices);
            this.pushVertexArray(this.getNormals(v+this.deltav),normals);

            iu=0;
            for (let u=this.minu;u<this.maxu;u+=this.deltau)
            {
                let sideu=line1.length;
                const i0=iu+sideu*iv;
                const i1=i0+1;
                const i2=(iu+1)+sideu*(iv+1);
                const i3=iu+sideu*(iv+1);

                //first triangle
                indices.push(i0,i1,i2);
                //second triangle
                indices.push(i0,i2,i3);              

                ++iu;
            }

            ++iv;           
        }

        geometry.setIndex( indices );            
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( new Float32Array(vertices), 3 ) );
        geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( new Float32Array(normals), 3 ) );      
      //geometry.computeVertexNormals();

        return geometry;
    }

    public createMesh(m: THREE.Material): THREE.Mesh | null {
        return null;
    }

    private pushVertex(v: SurfacePoint, vertices: number[]): void {
        vertices.push(v.x,v.y,v.z);        
    }

    private pushVertexArray(v:SurfacePoint[],vertices:number[])
    {
        for (let v1 of v)
        {
            vertices.push(v1.x);
            vertices.push(v1.y);
            vertices.push(v1.z);
        }
    }

    private getLineOfPoints(v:number):SurfacePoint[]
    {
        const r:SurfacePoint[]=[];
        for (let u=this.minu;u<=this.maxu+this.deltau;u+=this.deltau)
        {
            let p:SurfacePoint=this.fn(u,v);
            const np={} as SurfacePoint;
            np.x=p.x;
            np.y=p.y;
            np.z=p.z;
            r.push(np);
        }
        return r;
    }

    private getNormals(v:number):SurfacePoint[]
    {
        const r:SurfacePoint[]=[];
        for (let u=this.minu;u<=this.maxu+this.deltau;u+=this.deltau)
        {   
            let n=this.fnNormal(u,v);
            let nn={} as SurfacePoint;
            nn.x=n.x;
            nn.y=n.y;
            nn.z=n.z;                
            r.push(nn);
        }
        return r;        

    }
    
}