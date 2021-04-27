import * as THREE from "three";
import Config from "../data/config";

// This helper class can be used to create and then place geometry in the scene
export default class Field {
  constructor(scene, type = "production", ghost = false) {
    this.scene = scene;
    this.selectedBays = [];
    this.type = type;

    this.geo = null;
    this.mesh = null;
    if (type != "heat") {
      this.height = 100;
    } else {
      this.height = 9.4;
    }
    this.direction = "vertical";
    this.dimension = Config.dimension[type];
    this.width = this.dimension.width * 2;
    this.group = new THREE.Group();
    this.ghost = ghost;
    this.tmpPosition = new THREE.Vector3();
    this.collision = false;

    this.bays = [];

    return (position, rotation) => {
      this.geo = new THREE.PlaneGeometry(this.height, this.width, 1, 1);

      const material = new THREE.MeshNormalMaterial({
        color: "red",
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
      this.mesh = new THREE.Mesh(this.geo, material);

      // Use ES6 spread to set position and rotation from passed in array
      !this.ghost && this.mesh.position.set(...position);
      this.mesh.rotation.set(...rotation);
      this.mesh.type = "field";

      this.group.updateMatrixWorld(false);

      this.group.add(this.mesh);
      this.scene.add(this.group);

      return this;
    };
  }

  repositionBays() {
    this.bays.forEach((bay, index) => {
      let baysWidth = this.direction == 'vertical' ? bay.obj.size.z : bay.obj.size.x;
      bay.index = index;

      let calculatePositionX =
        -(this.mesh.geometry.parameters.height / 2) + bay.obj.size.x / 2;
      let calculatePositionZ =
        this.mesh.position.z +
        this.mesh.geometry.parameters.height / 2 -
        baysWidth -
        bay.index * baysWidth;

      bay.obj.position.z = calculatePositionZ;
    });
  }

  update() {
    this.height = this.calculateHeight();
    this.width = this.dimension.width * this.bays.length;
    this.updatePlaneSizes();
    this.updatePlanePosition();
  }

  calculateHeight() {
    let bayHeights = this.bays
      .map((bay) => {
        return bay.obj.size.x;
      })
      .sort();
    return bayHeights[bayHeights.length - 1];
  }

  updatePlaneSizes() {
    this.geo = new THREE.PlaneGeometry(this.height, this.width * 2, 1, 1);
    this.mesh.geometry = this.geo;
  }

  updatePlanePosition() {
    if (this.bays[0]) {
      let baysWidth = this.direction == 'vertical' ? this.bays[0].obj.size.z : this.bays[0].obj.size.x;
      this.mesh.position.z =
        this.bays[0].obj.position.z -
        (this.bays.length - 1) * baysWidth;
      this.mesh.position.x = this.bays[0].obj.position.x;
    }
  }

  rotate() {
    this.direction = this.direction == "vertical" ? "horizontal" : "vertical";
    this.deselectAllBays();
    this.ghost = true;

    switch (this.direction) {
      case "horizontal":
        this.group.applyMatrix4(
          new THREE.Matrix4().makeRotationY(-Math.PI / 2)
        );
        break;
      case "vertical":
        this.group.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI / 2));
        break;
    }
  }

  add(bay) {
    let baysCount = this.bays.length;
    let baysWidth = this.direction == 'vertical' ? bay.obj.size.z : bay.obj.size.x;

    let calculatePositionX =
      this.mesh.position.x -
      this.mesh.geometry.parameters.width / 2 +
      bay.obj.size.x / 2;
    let calculatePositionZ =
      this.mesh.position.z +
      this.mesh.geometry.parameters.height / 2 -
      baysWidth -
      baysCount * baysWidth;

    bay.obj.position.set(calculatePositionX, bay.obj.position.y || 0, calculatePositionZ);
    bay.index = baysCount;
    bay.field = this;

    // Add to scene
    this.group.add(bay.obj.group);
    this.bays.push(bay);
    this.update();
  }

  clone(bay) {
    let baysCount = this.bays.length;
    let baysWidth = this.direction == 'vertical' ? bay.obj.size.z : bay.obj.size.x;

    let calculatePositionZ =
      this.mesh.position.z +
      this.mesh.geometry.parameters.height / 2 -
      baysWidth -
      baysCount * baysWidth;

    bay.obj.position.z = calculatePositionZ;
    bay.field = this;
    bay.duplicate = true;

    // Add to scene
    this.group.add(bay.obj.group);
    this.bays.splice(bay.index, 0, bay);

    setTimeout(() => {
      // check if there's collision for duplicated bays
      bay.obj.box.setFromObject(bay.obj);
      bay.collision = bay.checkCollision(this.app && this.app.fields);

      debugger;

      if(bay.collision) {
        this.remove(bay);
      } else {
        this.repositionBays();
        this.update();
      }
    }, 100);
  }

  removeField() {
    this.scene.remove(this.group);
  }

  removeAllBays() {
    this.bays.forEach((bay) => {
      //Removing all references
      this.group.remove(bay.ref);
      this.scene.remove(bay.obj.box.helper);
    });
    this.bays = [];
    this.removeField();
    this.ghost = false;
  }

  remove(bay) {
    if (this.bays.length < 2) {
      bay.getUnselected();
      this.removeField();
    }

    //Removing all references
    this.group.remove(bay.ref);
    this.scene.remove(bay.obj.box.helper);

    this.bays.splice(
      this.bays.findIndex(function (i) {
        return i.obj.uuid === bay.obj.uuid;
      }),
      1
    );
    this.update();
    this.repositionBays();
  }

  selectAllBays() {
    this.bays.forEach((bay) => {
      bay.getSelected();
    });
  }

  deselectAllBays() {
    this.selectedBays.forEach((bay) => {
      bay.getUnselected();
    });
  }

  getSelectedBays() {
    this.selectedBays = [];

    this.bays.forEach((bay) => {
      bay.ghost = this.ghost;
      if (bay.obj.selected) {
        this.selectedBays.push(bay);
      }
    });

    return this.selectedBays;
  }

  checkBaysCollision() {
    let check = false;
    this.bays.forEach((bay) => {
      if (bay.collision) {
        this.group.position.copy(this.tmpPosition);
        check = true;
      }
    });
    return check;
  }

  render(app) {
    this.app = app;
    this.selectedBays = [];

    this.bays.forEach((bay, index) => {
      bay.ghost = this.ghost;
      if (bay.obj.selected) {
        this.selectedBays.push(bay);
      }
    });

    this.checkBaysCollision();

    if (this.ghost) {
      app.ghostField = this;
      app.raycaster
        .intersectObjects(app.scene.children, true)
        .forEach((intersect) => {
          if (intersect.object.type == "ground") {
            this.group.position.set(intersect.point.x, 0, intersect.point.z);
            this.tmpPosition.copy(intersect.point);
          }
        });
    } else {
      app.ghostField = null;
    }
  }
}
