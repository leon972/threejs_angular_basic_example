import { Vector3 } from "three";
import { Point3D } from "./parametric-surface";

//build a parametric curve made of segments
export class ParametricCurve
{
    public constructor(private readonly fn: (t: number) => Point3D,private readonly mint:number,private readonly maxt:number,private readonly deltat:number)
    {

    }

    public createGeometry():Array<Vector3>
    {
        const res=new Array<Vector3>();
        for (let t=this.mint;t<=this.maxt;t+=this.deltat)
        {
            const p:Point3D=this.fn(t);
            res.push(new Vector3(p.x,p.y,p.z));
        }
        return res;
    }
}