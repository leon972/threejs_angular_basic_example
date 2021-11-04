import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Canvas3DComponent } from '../engine3d/canvas3-d/canvas3-d.component';
import { MaterialUtils, SimpleCube } from '../engine3d/utils3d';
import * as THREE from "three";
import { BaseMesh, Model3DMultiMesh, GeneralMesh, WireframeMesh } from '../engine3d/model3dmultimesh';
import * as dat from 'dat.gui';
import { HollowCylinder } from './primitives/hollow-cylinder';
import { LineModel3D } from '../engine3d/linemodel';
import { Model3D } from '../engine3d/model3d';

let _this: any;

@Component({
  selector: 'app-canvas-client-test',
  templateUrl: './canvas-client-test.component.html',
  styleUrls: ['./canvas-client-test.component.scss']
})
export class CanvasClientTestComponent implements OnInit, AfterViewInit {

  @ViewChild('c3d') canvas3d!: Canvas3DComponent;

  private cube!: SimpleCube;
  private obj1!: Model3DMultiMesh;
  private cyl!:HollowCylinder;
  private line3d?:LineModel3D;
  private shaft:Array<HollowCylinder>=[];

  constructor() {

    _this = this;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //this.cube = new SimpleCube(5, 5, 5, MaterialUtils.createPhongMaterial(new THREE.Color(0xff2222)));
    this.cube = new SimpleCube(5, 5, 5, new THREE.MeshStandardMaterial({color:0xff0000}));
    this.cube.setPosition(0, 0, 15);
    this.cube.setRotation(0.12, -0.9, -1);
    //multi mesh
    this.obj1 = new Model3DMultiMesh();
    const mat1 = MaterialUtils.createPhongMaterial(0x003356);
    mat1.opacity = 0.8;
    mat1.transparent = true;
    const m1: GeneralMesh = this.obj1.addMesh("base",new BaseMesh(new THREE.BoxGeometry(4, 3, 2), mat1));
    this.obj1.addMesh("wireframe",new WireframeMesh(new THREE.BoxGeometry(4.02, 3.02, 2.02), 0x003860, true, 0.7));
    this.obj1.setPosition(12, 4, 18);
    this.obj1.setRotation(0.56, 0.11, 0.45);

    this.cyl=new HollowCylinder(0,10,8,14,0x49718C,0x6BCBDF,0x7eb6bd,0x87d6c8);
    this.cyl.setPosition(-10,3,15);
    this.line3d=this.createTestLine3d();

    var guiProps={
      enableWireframe:true,
      shaftSolid:true,
      shaftWireframe:true,
      resetCam:()=>{
        this.canvas3d.getCurrentCamera()?.resetToDefaultPosition();
      },
      bvalue:true,
      savePos:()=>{
        this.canvas3d.getCurrentCamera()?.saveCurrentPosition("cur");
      },
      restorePos:()=>{
        this.canvas3d.getCurrentCamera()?.setPosition("cur");
      }

    };

    const gui = new dat.GUI()
    const renderFolder = gui.addFolder('Rendering')
    renderFolder.add(guiProps, 'enableWireframe').onChange((value)=> {
    this.setShaftWireframe(value);
    }); 
    renderFolder.add(guiProps, 'shaftSolid').onChange((value)=> {
      this.setShaftSolid(value);
      });       
    renderFolder.open()
    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(guiProps,"resetCam");
    cameraFolder.add(guiProps,"bvalue").name("enabled orbit controls").onChange((value)=>{
      this.canvas3d.getCurrentCamera()?.setOrbitControlsEnabled(value);
    })
    cameraFolder.add(guiProps,"savePos").name("Save camera position");
    cameraFolder.add(guiProps,"restorePos").name("Restore camera position");

    cameraFolder.open()

    //add the model to canvas3d
   // this.canvas3d.addDirectionalLight(0, 0, -4, 0xFFFFFF, 1);
    const scene=this.canvas3d.getScene();
    const light = new THREE.HemisphereLight( 0xffffbb, 0x080820,0.6 );
scene.add( light );
  //  this.canvas3d.addModel(this.cube);
   // this.canvas3d.addModel(this.obj1);
   // this.canvas3d.addModel(this.cyl);
    this.canvas3d.updateScene = this.updateScene;
    this.canvas3d.getDefaultCamera()?.setupOrbitControls(this.canvas3d, 0, 0, 18);
    this.addShaft([6,4,3, 8,4,3, 9,6,6, 9.665,6,5.44, 7,4,3, 7.2,5,4, 7.8,4,5, 11,4.12,2, 18,4,1.5, 14,4,0.8, 18,4,1.5, 5,4,6],0,0,0);
    this.canvas3d.addModel(this.line3d);
  }

  private updateScene(): void {
    if (_this.cube) {

      _this.cube.incRotation(0.01, 0.01, 0.02);
    }
    if (_this.obj1) {
      _this.obj1.incRotation(-0.01, 0.0, 0.01);
    } 
  } 

  private addShaft(data:number[],x0:number,y0:number,z0:number):void
  {
    if ((data.length % 3)!==0)
    {
      throw new Error("Invalid shaft data");
    }
    let z=0;
    for (let i=0;i<data.length;i+=3)
    {
      let de=data[i];
      let di=data[i+1];
      let len=data[i+2];
      const cyl:HollowCylinder=new HollowCylinder(90,de,di,len,0x49718C,0x6BCBDF,0x2A4D58,0x87d6c8);
      this.shaft.push(cyl);
      cyl.setPosition(x0,y0,z);
      z+=len;
      this.canvas3d.addModel(cyl);
    }    
  }

  private setShaftWireframe(v:boolean):void
  {
    this.shaft.forEach((s:HollowCylinder)=>s.showWireFrame(v));
  }
  
  private setShaftSolid(v:boolean):void
  {
    this.shaft.forEach((s:HollowCylinder)=>s.showSolid(v));
  }

  private createTestLine3d():LineModel3D
  {
     const vertices:THREE.Vector3[]=[
      new THREE.Vector3(0,0,0),
      new THREE.Vector3(6,4,3),
      new THREE.Vector3(-2,3,4),
      new THREE.Vector3(11,8,9)
     ];

     return new LineModel3D(vertices,0xD3D3D3,true,0xFF0000,0.3);
  }

}


