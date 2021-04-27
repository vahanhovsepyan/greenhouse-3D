import * as THREE from "three";

// This helper class can be used to create event listeners
export default class Events {
  constructor(app) {
    const that = this;
    this.app = app;
    this.controls = {
      up: false,
      down: false,
      left: false,
      right: false,
      ctrl: false
    };
    this.mouseDown = false;

    app.renderer.container.addEventListener(
      "mousedown",
      this.onDocumentMouseDown.bind(this),
      false
    );
    app.renderer.container.addEventListener(
      "mouseup",
      this.onDocumentMouseUp.bind(this),
      false
    );
    app.renderer.container.addEventListener(
      "mousemove",
      this.onMouseMove.bind(this),
      false
    );
    window.addEventListener(
      "keydown",
      function (evt) {
        that.keyset(evt, true);
      },
      false
    );
    window.addEventListener(
      "keyup",
      function (evt) {
        that.keyset(evt, false);
      },
      false
    );
  }

  keyset(evt, trueOrFalse) {
    if(evt.metaKey) return;

    if (evt.key === "w") {
      this.controls.left = trueOrFalse;
    }
    if (evt.key === "s") {
      this.controls.right = trueOrFalse;
    }
    if (evt.key === "a") {
      this.controls.down = trueOrFalse;
    }
    if (evt.key === "d") {
      this.controls.up = trueOrFalse;
    }
    if(evt.key === "Control") {
      this.controls.ctrl = trueOrFalse;
    }
    if (evt.key === "Escape") {
      this.app.ghostField && this.app.ghostField.removeAllBays();
    }
  }

  onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    this.app.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.app.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.onDocumentMouseMove(event);
  }

  onDocumentMouseMove(event) {
    const that = this.app;

    that.raycaster.setFromCamera(that.mouse, that.camera.threeCamera);
    let intersects = that.raycaster.intersectObjects(
      that.scene.children,
      false
    );
    let breakLoop = false;

    intersects.forEach((intersect) => {
      if (intersect && intersect.object.type && !breakLoop) {
        if (intersect.object.type == "ground") {
          that.selectedElements &&
            that.selectedElements.forEach((el) => {
              el.changePosition(intersect.point, this.mouseDown);
            });
        } else if(intersect.object.type == 'back-control') {
          that.renderer.container.style.cursor = "n-resize";
        }
        breakLoop = true;
      }
    });
  }

  onDocumentMouseDown(event) {
    const that = this.app;

    that.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    that.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    that.raycaster.setFromCamera(that.mouse, that.camera.threeCamera);
    let intersects = that.raycaster.intersectObjects(that.scene.children, that.ghostField ? false : true);
    let breakLoop = false;

    intersects.forEach((intersect) => {
      if (intersect && intersect.object.type && !breakLoop) {
        if (intersect.object.type == "bay") {
          that.controls.threeControls.enabled = false;
          this.mouseDown = true;

          if(!this.controls.ctrl) {
            if (!intersect.object.selected) {
              that.deselectAllBays();
              intersect.object.proto.field.selectAllBays();
            } else {
              intersect.object.proto.field.deselectAllBays();
              intersect.object.proto.getSelected();

              that.selectedElements = that.getSelectedBays();
            }
          } else {
            intersect.object.proto.getSelected();
          }

          that.selectedElements = that.getSelectedBays();
        } else if (that.ghostField && !that.ghostField.collision && intersect.object.type == "ground") {
          that.ghostField.ghost = false;
        }
        breakLoop = true;
      }
    });
  }

  onDocumentMouseUp(event) {
    const that = this.app;

    that.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    that.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // find intersections
    that.raycaster.setFromCamera(that.mouse, that.camera.threeCamera);
    let intersects = that.raycaster.intersectObjects(that.scene.children, true);
    let breakLoop = false;

    intersects.forEach((intersect) => {
      if (!breakLoop) {
        if (intersect.object.type == "ground") {
          // Unselect all bays if clicked away
          that.deselectAllBays();
          that.selectedElements = [];
        }
        breakLoop = true;
      }
    });

    this.mouseDown = false;
    that.controls.threeControls.enabled = true;
  }
}
