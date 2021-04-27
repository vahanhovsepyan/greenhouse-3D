import { Component, OnInit, Input } from '@angular/core';
import { of, Observable } from "rxjs";

@Component({
  selector: 'app-canvas-builder',
  templateUrl: './canvas-builder.component.html',
  styleUrls: ['./canvas-builder.component.scss']
})
export class CanvasBuilderComponent implements OnInit {
  @Input() data: any;
  width = window.innerWidth - 400;
  height = window.innerHeight - 200;

  public configStage: Observable<any> = of({
    width: this.width,
    height: this.height
  });
  public backgroundRect: Observable<any> = of({
    x: 0,
    y: 0,
    width: this.width,
    height: this.height,
    fill: "#758a52",
  })

  public handleClick(component) {
    console.log("Hello Circle", component);
  }

  constructor() { }

  ngOnInit() {
  }

}
