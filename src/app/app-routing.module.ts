import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanvasClientTestComponent } from './canvas-client-test/canvas-client-test.component';
import { Canvas3DComponent } from './engine3d/canvas3-d/canvas3-d.component';

const routes: Routes = [
  {
    path:"**",
    component:CanvasClientTestComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
