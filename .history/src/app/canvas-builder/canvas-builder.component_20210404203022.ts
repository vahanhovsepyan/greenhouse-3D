import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { of, Observable } from "rxjs";
import { KonvaComponent } from 'ng2-konva';

@Component({
  selector: 'app-canvas-builder',
  templateUrl: './canvas-builder.component.html',
  styleUrls: ['./canvas-builder.component.scss']
})
export class CanvasBuilderComponent implements OnInit {
  @ViewChild('stage') stage: KonvaComponent;
  
  @Input() data: any;
  width = window.innerWidth - 400;
  height = window.innerHeight - 200;
  scale = this.width / this.height;

  configStage: Observable<any> = of({
    width: this.width,
    height: this.height
  });
  backgroundRect: Observable<any> = of({
    x: 0,
    y: 0,
    width: this.width,
    height: this.height,
    fill: "#758a52",
  })

  handleClick(component) {
    console.log("Hello Circle", component);
  }

  resizeCanvas() {

    this.width = window.innerWidth - 400;
    this.height = window.innerHeight - 200;
    this.scale = this.width / this.height;

    this.configStage.width(this.width * this.scale);
    this.configStage.height(this.height * this.scale);
    this.configStage.scale({ x: this.scale, y: this.scale });
    this.configStage.draw();

  }

  constructor() { }

  ngOnInit() {
    window.addEventListener('resize', this.resizeCanvas);
  }

}
