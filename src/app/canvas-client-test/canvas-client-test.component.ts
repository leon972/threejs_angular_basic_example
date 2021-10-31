import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Canvas3DComponent } from '../engine3d/canvas3-d/canvas3-d.component';
import { MaterialUtils, SimpleCube } from '../engine3d/utils3d';
import * as THREE from "three";
import { BaseMesh, Model3DMultiMesh, GeneralMesh, WireframeMesh } from '../engine3d/model3dmultimesh';
import * as dat from 'dat.gui';

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

  constructor() {

    _this = this;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.cube = new SimpleCube(5, 5, 5, MaterialUtils.createPhongMaterial(new THREE.Color(0xff2222)));
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


    var guiProps={
      enableWireframe:true,
      resetCam:()=>{
        this.canvas3d.getDefaultCamera()?.resetToDefaultPosition();
      },
    };

    const gui = new dat.GUI()
    const renderFolder = gui.addFolder('Rendering')
    renderFolder.add(guiProps, 'enableWireframe').onChange((value)=> {
      this.obj1.setMeshEnabled("wireframe",value);
    });
    renderFolder.open()
    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(guiProps,"resetCam");

    cameraFolder.open()

    //add the model to canvas3d
    this.canvas3d.addDirectionalLight(0, 0, -4, 0xFFFFFF, 1);
    this.canvas3d.addModel(this.cube);
    this.canvas3d.addModel(this.obj1);
    this.canvas3d.updateScene = this.updateScene;
    this.canvas3d.getDefaultCamera()?.setupOrbitControls(this.canvas3d, 0, 0, 18);
  }

  private updateScene(): void {
    if (_this.cube) {

      _this.cube.incRotation(0.01, 0.01, 0.02);
    }
    if (_this.obj1) {
      _this.obj1.incRotation(-0.01, 0.0, 0.01);
    }
  }

}


