import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three";
import { PerspectiveCamera } from 'three';
import { Model3D } from '../model3d';

@Component({
  selector: 'app-canvas3d',
  templateUrl: './canvas3-d.component.html',
  styleUrls: ['./canvas3-d.component.scss']
})
export class Canvas3DComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('canvas')
  private canvasRef!: ElementRef;
  @Input() updateScene?: () => void;
  @Input() updateOnResize = true;
  @Input() useWindowSize = true;
  private defaultCamera?: THREE.PerspectiveCamera;
  private currentCamera: THREE.Camera | undefined;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private animFrameID: number | undefined;

  constructor() {

  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  public setCurrentCamera(camera: THREE.Camera | undefined): void {
    this.currentCamera = camera;
  }

  public getCurrentCamera(): THREE.Camera | undefined {
    return this.currentCamera;
  }

  public getAspectRatio(): number {
    return this.getWidth()/this.getHeight();
  }

  public getWidth():number
  {
    return this.useWindowSize ? window.innerWidth : this.canvas.clientWidth;
  }

  public getHeight():number
  {
    return this.useWindowSize ? window.innerHeight : this.canvas.clientHeight;
  }

  public getDefaultCamera(): THREE.Camera | undefined {
    return this.defaultCamera;
  }

  public stopRenderingLoop(): void {
    if (this.animFrameID) {
      cancelAnimationFrame(this.animFrameID);
    }
  }

  public setSceneBacckGround(color: THREE.Color | THREE.Texture | null): void {
    this.scene.background = color;
  }

  public getSceneBackground(): THREE.Color | THREE.Texture | null {
    return this.scene.background;
  }

  public startRenderingLoop(): void {
    this.stopRenderingLoop();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    const _this = this;
    (function animate() {
      _this.animFrameID = requestAnimationFrame(animate);
      if (_this.updateScene) {
        _this.updateScene();
      }
      if (_this.currentCamera) {
        _this.renderer.render(_this.scene, _this.currentCamera);
      }
    }
    )();
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }

  public addDirectionalLight(xpos: number, ypos: number, zpos: number, color: THREE.ColorRepresentation, intensity: number = 1, target: THREE.Object3D | undefined = undefined): THREE.DirectionalLight {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(xpos, ypos, zpos);
    if (target) {
      light.target = target;
      target.updateMatrixWorld(); //if target moves udate this matrix at each frame
    }
    this.scene.add(light);
    return light;
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

    const _this = this;

    window.addEventListener('resize', () => {
      if (_this.updateOnResize) {
        const ar = this.getAspectRatio();
        if (this.currentCamera) {
          
          if (this.currentCamera instanceof PerspectiveCamera) {
            const pcamera:PerspectiveCamera=this.currentCamera as PerspectiveCamera;
          pcamera.aspect = this.getAspectRatio();
          this.currentCamera.updateProjectionMatrix();
          // this.currentCamera.updateProjectionMatrix();
          }
          this.renderer.setSize(this.getWidth(),this.getHeight());
        }
      }

    }, false);


    this.defaultCamera = new THREE.PerspectiveCamera(75, this.getAspectRatio(), 1, 1000);
    this.defaultCamera.position.set(0, 0, 0);
    this.defaultCamera.lookAt(0, 0, 1); //look positive z axis
    this.defaultCamera.layers.enableAll();
    this.scene = new THREE.Scene();
    this.setSceneBacckGround(new THREE.Color(0x000000));
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.currentCamera = this.defaultCamera;
    this.scene.add(this.defaultCamera);

    this.startRenderingLoop();
  }

  ngOnDestroy(): void {
    this.startRenderingLoop();
  }

  public addModel(m: Model3D): void {
    if (this.scene && m) {
     m.addToScene(this.scene);
    }
  }

  public removeModel(m: Model3D | undefined): void {
    if (m) {
      this.scene.remove(m as any);
    }
  }

}
