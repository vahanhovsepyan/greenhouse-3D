import { Component, OnInit, Input } from '@angular/core';
import { of, Observable } from "rxjs";

@Component({
  selector: 'app-canvas-builder',
  templateUrl: './canvas-builder.component.html',
  styleUrls: ['./canvas-builder.component.scss']
})
export class CanvasBuilderComponent implements OnInit {
  @Input() data: any;

  public configStage: Observable<any> = of({
    width: 500,
    height: 500
  });
  public configCircle: Observable<any> = of({
    x: 100,
    y: 100,
    radius: 70,
    fill: "red",
    stroke: "black",
    strokeWidth: 4
  });

  public handleClick(component) {
    console.log("Hello Circle", component);
  }

  constructor() { }

  ngOnInit() {
  }

}
