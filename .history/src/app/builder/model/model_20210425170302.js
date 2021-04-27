import * as THREE from "three";

import { BufferGeometryUtils } from "../utils/bufferGeometryUtils";
import Config from "../data/config";

// Loads in a single object from the config file
export default class Model {
  constructor(scene, manager, mesh, type = "production", dimension) {
    this.scene = scene;
    this.manager = manager;

    this.obj = null;
    this.type = type;
    this.index = 0;
    this.ghost = false;
    this.marked = false;
    this.ref = null;
    this.field = null;
    this.dimension = (dimension && dimension.dimension) || Object.assign({}, Config.dimension[this.type]);
    this.speedWalking = 100;
    this.tmpPosition = new THREE.Vector3();
    this.time = null;
    this.duplicate = false;
    this.stepLines = [];
    this.stepSize = (dimension && dimension.steps.size) || Config.dimension.steps.size;

    // onProgress callback
    // manager.onProgress = (item, loaded, total) => {
    //   console.log(`${item}: ${loaded} ${total}`);
    // };

    this.init(mesh);
  }

  init(mesh) {
    let group = new THREE.Group();

    if (this.type == "heat") {
      this.dimension.width = Math.pow(
        this.dimension.volume / (Math.PI * this.dimension.height),
        0.5
      );

      const geometry = new THREE.CylinderGeometry(
        this.dimension.width,
        this.dimension.width,
        this.dimension.height,
        32
      );
      const material = new THREE.MeshBasicMaterial({
        color: Config.mesh.material[this.type].color,
      });
      const cylinder = new THREE.Mesh(geometry, material);
      cylinder.position.y = this.dimension.height / 2;
      mesh = cylinder;
    } else {
      // mesh.geometry = mesh && mesh.geometry.toBufferGeometry();
    }

    this.obj = mesh;
    this.obj.material = new THREE.MeshPhongMaterial({
      color: Config.mesh.material[this.type].color,
      emissive: Config.mesh.material[this.type].emissive,
      transparent: true,
      opacity: 1,
    });
    this.obj.selected = false;
    this.obj.prevPositions = [];
    if (this.type != "heat") {
      this.obj.scale.set(
        Config.dimension[this.type].scale,
        this.dimension.height,
        this.dimension.width / 2
      );
      this.initLines(group);
    }
    this.ref = group;

    // ensure the bounding box is computed for its geometry
    // this should be done only once (assuming static geometries)
    this.obj.geometry.computeBoundingBox();

    // To make sure that the matrixWorld is up to date for the boxhelpers
    group.updateMatrixWorld(true);
    group.add(this.obj);
    this.updateBoxSize();

    if (Config.shadow.enabled) {
      this.obj.receiveShadow = true;
      this.obj.castShadow = true;
    }

    this.obj.proto = this;
    this.obj.type = "bay";

    this.obj.group = group;
  }

  isCorridor() {
    return this.type === "corridor";
  }

  initLines(group) {
    const edges = new THREE.EdgesGeometry( this.obj.geometry );
    const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
    line.position.y = 10;
    line.material.transparent = true;
    line.material.opacity = 0.25;
    line.scale.set(
      0.01,
      this.dimension.height,
      this.dimension.width / 2
    );
    this.obj.baseLine = line;
  }

  updateBoxSize() {
    this.obj.box = new THREE.Box3().setFromObject(this.obj);
    this.obj.box
      .copy(this.obj.geometry.boundingBox)
      .applyMatrix4(this.obj.matrixWorld);
    this.obj.size = this.obj.box.getSize(new THREE.Vector3());

    this.obj.box.helper = new THREE.Box3Helper(this.obj.box, 0xffff00);
    // this.scene.add(this.obj.box.helper);
  }

  getSelected() {
    this.obj.selected = true;
    this.obj.material.color = new THREE.Color(
      Config.mesh.material[this.type].selectedColor
    );
  }

  getUnselected() {
    this.obj.selected = false;
    this.obj.material.color = new THREE.Color(
      Config.mesh.material[this.type].color
    );
  }

  checkCollision(fields) {
    let self = this;
    let staticCollideMesh = [];
    let boxesCollision = false;

    fields &&
      fields.map((field) => {
        if (self.field.geo.uuid != field.geo.uuid) {
          field.bays.map((bay) => {
            if (self.obj.uuid !== bay.obj.uuid) {
              staticCollideMesh.push(bay);
            }
          });
        }
      });
    staticCollideMesh.some(function (mesh) {
      if (self.obj.box.intersectsBox(mesh.obj.box)) {
        boxesCollision = true;
        return true;
      }
    });
    if (boxesCollision && !this.ghost && this.obj.selected) {
      self.obj.position.copy(self.tmpPosition);
      self.field.group.position.copy(self.field.tmpPosition);
    }
    self.field.collision = boxesCollision;

    return boxesCollision;
  }

  updateFieldMovement(events, time) {
    let speed = this.speedWalking / this.field.bays.length;

    this.field.tmpPosition.copy(this.field.group.position);

    // Forward
    if (events.controls.up == true) {
      this.field.group.translateZ(-speed * time);
    }
    // Back
    if (events.controls.down == true) {
      this.field.group.translateZ(speed * time);
    }
    // Left
    if (events.controls.left == true) {
      this.field.group.translateX(-speed * time);
    }
    // Right
    if (events.controls.right == true) {
      this.field.group.translateX(speed * time);
    }
  }

  changePosition(point, mouseDown) {
    let coords = {
      x: (point.x - this.field.group.position.x) / 100,
      z: (point.z - this.field.group.position.z) / 100,
    };
    let direction = this.field.direction;
    let speed = this.speedWalking / this.field.bays.length;

    if (this.obj.selected && mouseDown && this.isFieldSelected()) {
      if(direction == 'vertical') {
        this.field.group.translateX(coords.x * speed * this.time);
        this.field.group.translateZ(coords.z * speed * this.time);
      } else {
        this.field.group.translateX(coords.z * speed * this.time);
        this.field.group.translateZ(-coords.x * speed * this.time);
      }
    } else if (this.obj.selected && mouseDown) {
      direction == 'vertical' && this.obj.translateX(coords.x * speed * this.time);
      direction == 'horizontal' && this.obj.translateX(coords.z * speed * this.time);
    }
  }

  addSection() {
    this.obj.scale.x = this.obj.scale.x + (this.stepSize / 2);

    if(this.obj.scale.x * 2 > Config.dimension[this.type].max) {
      this.obj.scale.x = parseInt(Config.dimension[this.type].max) / 2;
    } else if(this.obj.scale.x * 2 < Config.dimension[this.type].min) {
      this.obj.scale.x = parseInt(Config.dimension[this.type].min) / 2;
    } else {
      this.obj.position.x = this.obj.position.x - (this.stepSize / 2);
    }

    if(this.collision) {
      this.obj.scale.x = this.obj.scale.x - (this.stepSize / 2);
      this.obj.position.x = this.obj.position.x + (this.stepSize / 2);
    }

    this.updateBoxSize(this.obj);
  }

  removeSection() {
    this.obj.scale.x = this.obj.scale.x - (this.stepSize / 2);

    if(this.obj.scale.x * 2 > Config.dimension[this.type].max) {
      this.obj.scale.x = parseInt(Config.dimension[this.type].max) / 2;
    } else if(this.obj.scale.x * 2 < Config.dimension[this.type].min) {
      this.obj.scale.x = parseInt(Config.dimension[this.type].min) / 2;
    } else {
      this.obj.position.x = this.obj.position.x + this.stepSize / 2;
    }

    this.updateBoxSize(this.obj);
  }

  isFieldSelected() {
    if (this.field.getSelectedBays().length == this.field.bays.length) {
      return true;
    } else {
      return false;
    }
  }

  drawLines() {
    // this.updateBoxSize();

    let stepsCount = (this.field.direction == 'vertical' ? this.obj.size.x : this.obj.size.x) / this.stepSize;
    let baseLineX = this.field.direction == 'vertical' ? (this.obj.position.x + (this.obj.size.x / 2)) : (this.obj.position.x + (this.obj.size.x / 2));

    //remove lines
    this.stepLines.forEach((line) => {
        this.obj.group.remove(line);
    });

    for(let i = 0; i <= stepsCount; i++) {
      let line = this.obj.baseLine.clone();
      line.position.set(baseLineX - (i * this.stepSize), this.obj.position.y, this.obj.position.z);
      this.stepLines.push(line);
      this.obj.group.add(line);
    }
  }

  render(app, time) {
    // Update position
    this.obj.box.setFromObject(this.obj);
    this.collision = this.checkCollision(app.fields);
    this.tmpPosition.copy(this.obj.position);

    if (this.obj.selected && this.isFieldSelected()) {
      this.updateFieldMovement(app.events, time);
    }

    // Render function for model
    if (this.ghost) {
      this.obj.material.opacity = 0.5;
      this.obj.type = "ghost";
    } else if(this.marked) {
      this.obj.material.opacity = 0.2;
    } else {
      this.obj.material.opacity = 1;
      this.obj.type = "bay";
    }

    this.obj.baseLine && this.drawLines();

    this.time = time;
  }
}
