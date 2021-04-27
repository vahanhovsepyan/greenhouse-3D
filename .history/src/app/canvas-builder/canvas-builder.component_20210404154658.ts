import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-canvas-builder',
  templateUrl: './canvas-builder.component.html',
  styleUrls: ['./canvas-builder.component.scss']
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
