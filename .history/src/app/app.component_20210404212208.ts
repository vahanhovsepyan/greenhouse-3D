import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'greenhouse-threejs';
  data = {};
  show = true;

  getData(event) {
    this.show = true;
  }

  hide2D() {
    this.show = false;
  }
}
