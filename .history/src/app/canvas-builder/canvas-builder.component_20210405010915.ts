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
    // Get the device pixel ratio, falling back to 1.
    let dpr = window.devicePixelRatio || 1;
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    var ctx = canvas.getContext('2d');
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    ctx.scale(dpr, dpr);
    return ctx;
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
      this.ctx.fillStyle = 'white';
      this.ctx.rect(object.x, object.y, object.width, object.height);
      this.ctx.fill();
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
      block.elements.forEach((element) => {
        let config = {
          x: this.origin.x - block.z - element.z,
          y: this.origin.y + block.x + element.x,
          width: element.size.z,
          height: element.size.x,
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
