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
  @ViewChild('stage') stage: any;

  @Input() data: any;
  @Input() show: boolean;
  @Output() hideEmitter = new EventEmitter();
  ctx: any;

  width = window.innerWidth - 400;
  height = window.innerHeight - 200;
  origin = {
    x: this.width / 2,
    y: this.height / 2
  };
  initCanvas = false;
  blocks = {
    production: [],
    technical: [],
    heat: [],
    corridor: []
  };

  constructor() { }

  ngOnInit() {
    let canvas = this.stage.nativeElement;

    canvas.width = this.width;
    canvas.height = this.height;

    this.ctx = canvas.getContext("2d");

    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(200, 100);
    this.ctx.stroke();

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
          x: this.origin.x + element.x + block.x,
          y: this.origin.y + element.z + block.z,
          width: element.size.z,
          height: element.size.x,
          fill: "red",
        };

        this.blocks[block.type].push(config);
      });
    });

    debugger;

    this.initCanvas = true;
  }

  hideEmit() {
    this.hideEmitter.emit();
  }

  resizeCanvas() {
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

}
