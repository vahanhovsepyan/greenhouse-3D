import * as THREE from 'three';

import Config from '../data/config';
import { CSS3DRenderer } from '../utils/CSS3DRenderer.js';

// Main webGL renderer class
export default class Renderer {
  constructor(scene, cssScene, container) {
    // Properties
    this.scene = scene;
    this.cssScene = cssScene;
    this.container = container;

    // Create WebGL renderer and set its antialias
    this.threeRenderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

    // Set clear color to fog to enable fog or to hex color for no fog
    // this.threeRenderer.setPixelRatio(window.devicePixelRatio); // For retina

    // Appends canvas
    container.appendChild(this.threeRenderer.domElement);

    // Shadow map options
    this.threeRenderer.shadowMap.enabled = true;
    this.threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.cssRenderer = new CSS3DRenderer();
    this.cssRenderer.setSize( window.innerWidth, window.innerHeight );
    this.cssRenderer.domElement.style.position = 'absolute';
    this.cssRenderer.domElement.style.pointerEvents = 'none';
    this.cssRenderer.domElement.style.top = 0;
    document.body.appendChild( this.cssRenderer.domElement );

    // Get anisotropy for textures
    Config.maxAnisotropy = this.threeRenderer.capabilities.getMaxAnisotropy();

    // Initial size update set to canvas container
    this.updateSize();

    // Listeners
    document.addEventListener('DOMContentLoaded', () => this.updateSize(), false);
    window.addEventListener('resize', () => this.updateSize(), false);
  }

  updateSize() {
    this.threeRenderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    this.cssRenderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
  }

  render(scene, cssScene, camera) {
    // Renders scene to canvas target
    this.threeRenderer.render(scene, camera);
    this.cssRenderer.render(cssScene, camera);
  }
}
