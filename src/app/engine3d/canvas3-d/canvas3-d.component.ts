import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three";
import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Camera3D, PerspectiveCamera3D } from '../cmeras';
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
  //set camera apsect ratio on resize
  @Input() updateOnResize = true;
  private defaultCamera?: Camera3D;
  private currentCamera: Camera3D | undefined;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private animFrameID: number | undefined;
  private ambientLight?: THREE.AmbientLight = new THREE.AmbientLight(0xffffff);

  constructor() {
  }

  public get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  public setCurrentCamera(camera: Camera3D | undefined): void {
    this.currentCamera = camera;
  }

  public getCurrentCamera(): Camera3D | undefined {
    return this.currentCamera;
  }

  public getAspectRatio(): number {
    return this.getWidth() / this.getHeight();
  }

  public getWidth(): number {
    return this.canvas.clientWidth;
  }

  public getHeight(): number {
    return this.canvas.clientHeight;
  }

  public getDefaultCamera(): Camera3D | undefined {
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

  public getOrbitControls(camera: Camera3D): OrbitControls {
    return new OrbitControls(camera.getCamera(), this.renderer.domElement);
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
        _this.currentCamera.update();
        _this.renderer.render(_this.scene, _this.currentCamera.getCamera());
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
     
        if (this.currentCamera) {

          if (this.currentCamera instanceof PerspectiveCamera) {
            const pcamera: PerspectiveCamera = this.currentCamera as PerspectiveCamera;
            pcamera.aspect =this.getAspectRatio();
            this.currentCamera.updateProjectionMatrix();
            // this.currentCamera.updateProjectionMatrix();
          }
          this.renderer.setSize(this.getWidth(), this.getHeight());
        }
      }

    }, false);

    this.scene = new THREE.Scene();
    if (this.ambientLight) {
      this.ambientLight.intensity = 0.4;
      this.ambientLight.visible = true;
      this.scene.add(this.ambientLight);
    }

    this.defaultCamera = new PerspectiveCamera3D(75, this.getAspectRatio(), 1, 1000);
    this.defaultCamera.lookAt(0, 0, 1); //look positive z axis
    this.defaultCamera.getCamera().layers.enableAll();
    this.setSceneBacckGround(new THREE.Color(0x000000));
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.currentCamera = this.defaultCamera;
    this.defaultCamera.addToScene(this.scene);
    this.startRenderingLoop();

  }

  ngOnDestroy(): void {
    this.stopRenderingLoop();
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

  public enableAmbientLight(enabled: boolean): void {
    if (this.ambientLight) {
      this.ambientLight.visible = enabled;
    }
  }

  public setAmbientLight(color: THREE.Color, intensity: number): void {
    if (this.ambientLight) {
      this.ambientLight.color = color;
      this.ambientLight.intensity = intensity;
    }
  }

}
