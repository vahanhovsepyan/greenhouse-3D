import { Component, OnInit, Input } from '@angular/core';
import { of, Observable } from "rxjs";

@Component({
  selector: 'app-canvas-builder',
  templateUrl: './canvas-builder.component.html',
  styleUrls: ['./canvas-builder.component.scss']
})
export class CanvasBuilderComponent implements OnInit {
  @Input() data: any;
  width = 800;
  height = 500;

  public configStage: Observable<any> = of({
    width: this.width,
    height: this.height
  });
  public backgroundRect: Observable<any> = of({
    x: this.width,
    y: this.height,
    width: 50,
    height: 50,
    fill: "red",
  })

  public handleClick(component) {
    console.log("Hello Circle", component);
  }

  constructor() { }

  ngOnInit() {
  }

}
