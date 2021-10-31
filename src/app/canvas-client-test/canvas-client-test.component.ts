import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Canvas3DComponent } from '../engine3d/canvas3-d/canvas3-d.component';
import { SimpleCube } from '../engine3d/utils3d';
import * as THREE from "three";

let _this:any;

@Component({
  selector: 'app-canvas-client-test',
  templateUrl: './canvas-client-test.component.html',
  styleUrls: ['./canvas-client-test.component.scss']
})
export class CanvasClientTestComponent implements OnInit, AfterViewInit {


  @ViewChild('c3d') canvas3d!: Canvas3DComponent;

  private cube!: SimpleCube;
  
  constructor() {

    _this=this;
   }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.cube = new SimpleCube(5, 5, 5, new THREE.Color(0xFF2245));
    this.cube.setPosition(0, 0, -4);
    this.cube.setRotation(0.12, -0.9, -1);
    //add the model to canvas3d
    this.canvas3d.addModel(this.cube);
    this.canvas3d.updateScene = this.updateScene;
  }

  private updateScene(): void {
    if (_this.cube) {
      let m: THREE.Mesh | undefined=_this.cube.getMesh();
      if (m)
      {
       // m.position.x=m.position.x+0.01;
        m.rotation.x=m.rotation.x+0.01;
      }
    }
  }

}


