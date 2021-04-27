import { Component, OnInit, Input } from '@angular/core';
import { of, Observable } from "rxjs";

@Component({
  selector: 'app-canvas-builder',
  styleUrls: ['./canvas-builder.component.scss'],
  template: `
    <ko-stage [config]="configStage"
      <ko-layer>
        <ko-circle [config]="configCircle" (click)="handleClick($event)"></ko-circle>
      </ko-layer>
    </ko-stage>`
})
export class CanvasBuilderComponent implements OnInit {
  @Input() data: any;

  public configStage: Observable<any> = of({
    width: 200,
    height: 200
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
