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

  scale = window.devicePixelRatio;
  width = window.innerWidth * this.scale - 400;
  height = window.innerHeight * this.scale - 200;
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
    this.ctx = this.setupCanvas(this.stage.nativeElement, this.width, this.height);

    // Call draw() function for canvas
    this.draw();

    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }

  setupCanvas(canvas, width, height) {
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = width * this.scale;
    canvas.height = height * this.scale;

    return canvas.getContext('2d');
  }

  draw() {

    this.ctx.clearRect(0, 0, this.width, this.height);

    // draw layers one by one
    this.drawBackground();
    this.drawObjects();

    //RAF
    requestAnimationFrame(this.draw.bind(this));
  }

  drawBackground() {
    this.ctx.beginPath();
    this.ctx.fillStyle = '#758a52';
    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fill();
  }

  drawObjects() {
    if (!this.data.blocks) return;

    this.blocks.production.forEach((object) => {
      this.ctx.beginPath();
      this.ctx.strokeStyle = "black";
      this.ctx.fillStyle = 'white';
      this.ctx.rect(object.x - (object.width / 2), object.y - (object.height / 2), object.width, object.height);
      this.ctx.fill();
      this.ctx.stroke();
    });

    this.blocks.technical.forEach((object) => {
      this.ctx.beginPath();
      this.ctx.strokeStyle = "black";
      this.ctx.fillStyle = 'blue';
      this.ctx.rect(object.x - (object.width / 2), object.y - (object.height / 2), object.width, object.height);
      this.ctx.fill();
      this.ctx.stroke();
    });

    this.blocks.corridor.forEach((object) => {
      this.ctx.beginPath();
      this.ctx.strokeStyle = "black";
      this.ctx.fillStyle = 'grey';
      this.ctx.rect(object.x - (object.width / 2), object.y - (object.height / 2), object.width, object.height);
      this.ctx.fill();
      this.ctx.stroke();
    });

    this.blocks.heat.forEach((object) => {
      this.ctx.beginPath();
      this.ctx.strokeStyle = "black";
      this.ctx.fillStyle = 'red';
      this.ctx.arc(object.x, object.y, object.width / 2, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.stroke();
    });
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
      console.log(block);
      block.elements.forEach((element) => {
        let config = {
          x: block.direction == 'vertical' ? this.origin.x - (block.z + element.z) * this.scale : this.origin.x - (block.z - (- element.x)) * this.scale,
          y: block.direction == 'vertical' ? this.origin.y + (block.x + element.x) * this.scale : this.origin.y + (block.x + element.z) * this.scale,
          width: element.size.z * this.scale,
          height: element.size.x * this.scale,
          fill: "red",
        };

        this.blocks[block.type].push(config);
      });
    });

    this.initCanvas = true;
  }

  hideEmit() {
    this.hideEmitter.emit();
  }

  resizeCanvas() {
    let canvas = this.stage.nativeElement;

    this.width = window.innerWidth * this.scale - 400;
    this.height = window.innerHeight * this.scale - 200;

    canvas.width = this.width;
    canvas.height = this.height;

    this.origin = {
      x: this.width / 2,
      y: this.height / 2
    };
  }

}
