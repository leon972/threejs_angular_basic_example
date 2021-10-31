import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Canvas3DComponent } from './engine3d/canvas3-d/canvas3-d.component';
import { CanvasClientTestComponent } from './canvas-client-test/canvas-client-test.component';

@NgModule({
  declarations: [
    AppComponent,
    Canvas3DComponent,
    CanvasClientTestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
