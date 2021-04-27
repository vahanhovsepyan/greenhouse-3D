import { Component, OnInit, ViewChild, Output } from '@angular/core';
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

// Local imports -
// Components
import Renderer from "./components/renderer";
import Camera from "./components/camera";
import Light from "./components/light";
import Controls from "./components/controls";
import Environment from "./components/environment";
import Tools from "./components/tools";

// Helpers
import Stats from "./helpers/stats";
import Events from "./helpers/events";
import InfoBox from "./helpers/infobox";

// Model
import Model from "./model/model";
import Field from "./components/field";
import { GLTFLoader } from "./loaders/GLTFLoader";
import Helpers from "./utils/helpers";

// Managers
import DatGUI from "./managers/datGUI";

// data
import Config from "./data/config";

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent implements OnInit {

  @ViewChild('appContainer') appContainer;
  @Input() data: any;
  container: any;
  ghostField: any;
  clock: any;
  delta: any;
  manager: any;
  scene: any;
  cssScene: any;
  renderer: any;
  raycaster: any;
  mouse: any;
  camera: any;
  controls: any;
  light: any;
  stats: any;
  tools: any;
  gui: any;
  geometry: any;
  fields: any;
  bayMesh: any;
  events: any;
  infobox: any;
  view = {
    openDimensions: true
  };
  toast = {
    message: '',
    show: false,
    open(message) {
      this.message = message;
      this.show = true;
  
      setTimeout(() => {
        this.show = false;
      }, 2000);
    }
  };
  model = {
    dimensions: {
      production: {
        width: Config.dimension.production.width,
        height: Config.dimension.production.height
      },
      technical: {
        width: Config.dimension.technical.width,
        height: Config.dimension.technical.height
      },
      heat: {
        volume: Config.dimension.heat.volume
      },
      steps: {
        size: Config.dimension.steps.size
      }
    }
  };
  selectedElements: any;

  constructor() {
  }

  init() {
    this.container = this.appContainer.nativeElement;

    // Ghost Field selected
    this.ghostField = null;

    // Start Three clock
    this.clock = new THREE.Clock();
    this.delta = this.clock.getDelta();

    //Loading Manager
    this.manager = new THREE.LoadingManager();

    // Main scene creation
    this.scene = new THREE.Scene();
    this.cssScene = new THREE.Scene();
    // this.scene.fog = new THREE.FogExp2(Config.fog.color, Config.fog.near);

    // Get Device Pixel Ratio first for retina
    if (window.devicePixelRatio) {
      Config.dpr = window.devicePixelRatio;
    }

    // Main renderer constructor
    this.renderer = new Renderer(this.scene, this.cssScene, this.container);

    //Setup raycaster and mouse
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Components instantiations
    this.camera = new Camera(this.renderer.threeRenderer);
    this.controls = new Controls(this.camera.threeCamera, this.container);
    this.light = new Light(this.scene);

    // Set up rStats if dev environment
    if (Config.isDev && Config.isShowingStats) {
      this.stats = new Stats(this.renderer);
      this.stats.setUp();
    }

    //Tools
    this.tools = new Tools(this);

    // Set up gui
    if (Config.isDev) {
      this.gui = new DatGUI(this);
      this.gui.load(this);
    }

    // Create and place lights in scene
    const lights = ["ambient", "directional", "point", "hemi"];
    lights.forEach((light) => this.light.place(light));

    // Create and place geo in scene
    this.geometry = new Environment(this.scene);
    this.fields = [];
    this.bayMesh = null;
    new GLTFLoader(this.manager).load(
      Config.models[Config.model.selected].path,
      (gltf) => {
        const scene = gltf.scene;
        let mesh;

        if (Config.shadow.enabled) {
          scene.traverse((node) => {
            if (node.isMesh || node.isLight) node.castShadow = true;
            if (node.isMesh) {
              mesh = node;
            }
          });
        }

        this.bayMesh = mesh;
      },
      Helpers.logProgress(),
      Helpers.logError()
    );

    // Setting up event listeners
    this.events = new Events(this);

    // Setting up the infobox
    this.infobox = new InfoBox(this);

    // Start render which does not wait for model fully loaded
    this.render();
  }

  deselectAllBays() {
    this.fields.forEach((field) => {
      field.deselectAllBays();
    });
    this.selectedElements = [];
  }

  getSelectedBays() {
    let elements = [];

    this.fields.forEach((field) => {
      field.getSelectedBays().map(bay => elements.push(bay));
    });

    return elements;
  }

  openDimensions() {
    this.view.openDimensions = true;
  }

  resetCamera() {
    this.camera.threeCamera.position.set(Config.camera.posX, Config.camera.posY, Config.camera.posZ);
    this.controls.threeControls.target.set(Config.controls.target.x, Config.controls.target.y, Config.controls.target.z);
  }

  setDimensions() {
    if (!this.model.dimensions.heat.volume || isNaN(this.model.dimensions.heat.volume)) {
      this.model.dimensions.heat.volume = Config.dimension["heat"].volume;
    }

    Config.dimension["production"].width = parseFloat(this.model.dimensions.production.width);
    Config.dimension["production"].height = parseFloat(this.model.dimensions.production.height);
    Config.dimension["technical"].width = parseFloat(this.model.dimensions.technical.width);
    Config.dimension["technical"].height = parseFloat(this.model.dimensions.technical.height);
    Config.dimension["heat"].volume = parseFloat(this.model.dimensions.heat.volume);
    Config.dimension["steps"].size = parseFloat(this.model.dimensions.steps.size);

    if (!this.fields.length) {
      // this.manager.onLoad = () => {
      const firstField = new Field(this.scene)([0, 0, 0], [Math.PI / 2, 0, 0]);
      firstField.add(
        new Model(
          this.scene,
          this.manager,
          this.bayMesh && this.bayMesh.clone(),
          "production"
        )
      );
      this.fields.push(firstField);
      // };
    }

    this.view.openDimensions = false;
  }

  addField(type) {
    if (this.ghostField) return;
    this.deselectAllBays();

    let coords = [0, 0, 0];
    const newField = new Field(this.scene, type, true)(
      coords,
      [Math.PI / 2, 0, 0]
    );
    if (type == "production") {
      for (let i = 0; i < 4; i++) {
        newField.add(
          new Model(
            this.scene,
            this.manager,
            this.bayMesh && this.bayMesh.clone(),
            type
          )
        );
      }
    } else if (type == "technical") {
      for (let i = 0; i < 2; i++) {
        newField.add(
          new Model(
            this.scene,
            this.manager,
            this.bayMesh && this.bayMesh.clone(),
            type
          )
        );
      }
    } else {
      newField.add(
        new Model(
          this.scene,
          this.manager,
          this.bayMesh && this.bayMesh.clone(),
          type
        )
      );
    }

    this.fields.push(newField);
  };

  render() {
    // Render rStats if Dev
    if (Config.isDev && Config.isShowingStats) {
      Stats.start();
    }

    // Update delta
    this.delta = this.clock.getDelta();

    // Call render function and pass in created scene and camera
    this.renderer.render(this.scene, this.cssScene, this.camera.threeCamera);

    // rStats has finished determining render call now
    if (Config.isDev && Config.isShowingStats) {
      Stats.end();
    }

    this.fields.forEach((field) => {
      field.render(this, this.delta);
      field.bays.forEach((bay) => {
        bay.render(this, this.delta);
      });
    });

    // Update tools position
    this.tools.update();

    // Update infobox info
    this.infobox.update();

    // Call any vendor or module frame updates here
    TWEEN.update();
    this.controls.threeControls.update();

    this.data = 'amamamam';

    // RAF
    requestAnimationFrame(this.render.bind(this)); // Bind the main class instead of window object
  }

  ngOnInit() {
    this.init();
  }

}
