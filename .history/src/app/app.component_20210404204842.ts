import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'greenhouse-threejs';
  data = {};
  show = false;

  getData(event) {
    this.show = true;
    debugger;
  }
}
