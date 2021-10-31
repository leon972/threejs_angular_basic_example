import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Canvas3DComponent } from "./canvas3-d/canvas3-d.component";

export class CameraPosition
{
    private pos!:THREE.Vector3;
    private rot!:THREE.Vector3;

    public constructor(x:number,y:number,z:number,rx:number,ry:number,rz:number)
    {
        this.pos=new THREE.Vector3(x,y,z);
        this.rot=new THREE.Vector3(rx,ry,rz);
    }

    public set(x:number|undefined=undefined,y:number|undefined=undefined,z:number|undefined=undefined,
        rx:number|undefined=undefined,ry:number|undefined=undefined,rz:number|undefined=undefined):void
    {
        if (x!==undefined)
        {
            this.pos.x=x;
        }
        if (y!==undefined)
        {
            this.pos.y=y;
        }
        if (z!==undefined)
        {
            this.pos.z=z;
        }
        if (rx!=undefined)
        {
            this.rot.x=rx;
        }
        if (ry!=undefined)
        {
            this.rot.y=ry;
        }
        if (rz!=undefined)
        {
            this.rot.z=rz;
        }
    }

    public getRotation():THREE.Vector3
    {
        return this.rot;
    }

    public getPosition():THREE.Vector3
    {
        return this.pos;
    }

    public apply(camera:Camera3D):void
    {
        const c:THREE.Camera=camera.getCamera();
        c.position.set(this.pos.x,this.pos.y,this.pos.z);
        c.rotation.set(this.rot.x,this.rot.y,this.rot.z);
    }
}

export abstract class Camera3D
{
    protected camera!:THREE.Camera;
    private defaultPosition=new CameraPosition(0,0,0,0,0,0);  
    private positions:Map<string,CameraPosition>=new Map<string,CameraPosition>();
    private controls?:OrbitControls;
    private orbitcontrolsEnabled=false;

    public constructor(camera:THREE.Camera)
    {
        this.camera=camera;      
        this.defaultPosition.apply(this);        
    }

    public setupOrbitControls(canvas3d:Canvas3DComponent,targetx:number,targety:number,targetz:number):void
    {
        this.controls=canvas3d.getOrbitControls(this);
        this.controls.target.set(targetx,targety,targetz);
        this.orbitcontrolsEnabled=true;
        this.controls.update();
    }

    public getCamera():THREE.Camera
    {
        return this.camera;
    }

    public getDefaultPosition():CameraPosition
    {
        return this.defaultPosition;
    }

    public resetToDefaultPosition():void
    {
        this.defaultPosition.apply(this);
    }

    public lookAt(x:number,y:number,z:number):void
    {
        this.camera.lookAt(x,y,z);
    }

    public addPosition(name:string,pos:CameraPosition):CameraPosition
    {
        if (!name || !pos)
        {
            throw new Error('Invalid camera position!');
        }
        this.positions.set(name,pos);
        return pos;
    }

    public setPosition(posName:string):void
    {
        if (posName && this.positions.has(posName))
        {
            this.positions.get(posName)?.apply(this);
            this.update();
        }
    }

    public setPosition2(pos:CameraPosition):void
    {
        if (pos)
        {
            pos.apply(this);
            this.update();
        }
    }

    public addToScene(scene:THREE.Scene)
    {
        if (scene)
        {
            scene.add(this.getCamera());
        }
    }

    public setOrbitControlsEnabled(enabled:boolean)
    {
        this.orbitcontrolsEnabled=enabled;
    }

    public isOrbitControlEnabled():boolean
    {
        return this.orbitcontrolsEnabled;
    }

    public update():void
    {
        if (this.orbitcontrolsEnabled && this.controls)
        {
            this.controls.update();
        }
    }
}

export class PerspectiveCamera3D extends Camera3D
{
    public constructor(fov:number=75,aspectRatio:number=3/2,nearClipPlane:number=0.2,farClipPlane:number=1000)
    {
        super(new THREE.PerspectiveCamera(fov, aspectRatio, nearClipPlane,farClipPlane));
    }
}