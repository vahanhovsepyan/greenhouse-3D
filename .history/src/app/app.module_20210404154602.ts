import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Import KonvaModule
import { KonvaModule } from "ng2-konva";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BuilderComponent } from './builder/builder.component';
import { CanvasBuilderComponent } from './canvas-builder/canvas-builder.component';

@NgModule({
  declarations: [
    AppComponent,
    BuilderComponent,
    CanvasBuilderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    KonvaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
