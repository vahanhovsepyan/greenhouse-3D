import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-canvas-builder',
  templateUrl: './canvas-builder.component.html',
  styleUrls: ['./canvas-builder.component.scss']
})
export class CanvasBuilderComponent implements OnInit {

  @Input() data: any;

  constructor() { }

  ngOnInit() {
  }

}
