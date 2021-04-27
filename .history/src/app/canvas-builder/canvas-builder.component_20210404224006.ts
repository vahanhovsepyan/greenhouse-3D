import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { of, Observable } from "rxjs";
import { KonvaComponent } from 'ng2-konva';

declare const Konva: any;
let ng: any;

@Component({
  selector: 'app-canvas-builder',
  templateUrl: './canvas-builder.component.html',
  styleUrls: ['./canvas-builder.component.scss']
})
export class CanvasBuilderComponent implements OnInit {
  @ViewChild('stage') stage: KonvaComponent;
  @ViewChild('background') background: KonvaComponent;

  @Input() data: any;
  @Input() show: boolean;
  @Output() hideEmitter = new EventEmitter();

  width = window.innerWidth - 400;
  height = window.innerHeight - 200;
  origin = {
    x: this.width / 2,
    y: this.height / 2
  };

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
  });
  blocks = {
    production: [],
    technical: [],
    heat: [],
    corridor: []
  };

  handleClick(component) {
    console.log("Hello Circle", component);
  }

  resizeCanvas() {
    let stage = ng.stage.getStage();
    let background = ng.background.getStage();

    this.width = window.innerWidth - 400;
    this.height = window.innerHeight - 200;

    stage.width(this.width);
    stage.height(this.height);
    background.width(this.width);
    background.height(this.height);

    this.origin = {
      x: this.width / 2,
      y: this.height / 2
    };

    stage.draw();
    background.draw();
  }

  constructor() { }

  hideEmit() {
    this.hideEmitter.emit();
  }

  ngOnInit() {
    ng = this;
    window.addEventListener('resize', this.resizeCanvas);
  }

  ngOnChanges() {
    this.blocks = {
      production: [],
      technical: [],
      heat: [],
      corridor: []
    };

    if (!this.data.blocks) return;

    this.data.blocks.forEach((block) => {
      block.elements.forEach((element) => {
        let config = {
          x: this.origin.x + element.x,
          y: this.origin.y + element.z,
          width: element.size.width,
          height: element.size.height,
          fill: "red",
        };

        this.blocks[block.type].push(config);
      });
    });

    debugger;
  }

}
