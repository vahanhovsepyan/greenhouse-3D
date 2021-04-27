import * as THREE from "three";

import Material from "./material";
import Config from "../data/config";
import { Perlin } from "../utils/perlin";

// This helper class can be used to create and then place geometry in the scene
export default class Environment {
  constructor(scene) {
    this.scene = scene;

    this.initGround();
    this.initSky();
  }

  initGround() {
    const material = new THREE.MeshStandardMaterial({
      color: 0x758a52,
      shading: THREE.FlatShading,
      roughness: 1,
      metalness: 0,
      side: THREE.DoubleSide
    });
    const geometry = new THREE.PlaneBufferGeometry(4000, 4000, 100, 100);
    const mesh = new THREE.Mesh(geometry, material);

    // Use ES6 spread to set position and rotation from passed in array
    mesh.position.set(0, 0, 0);
    mesh.rotation.set(-Math.PI / 2, 0, 0);
    mesh.type = "ground";

    if (Config.shadow.enabled) {
      mesh.receiveShadow = true;
    }

    this.scene.add(mesh);
    this.addMountains();
  }

  addMountains() {
    const material = new THREE.MeshStandardMaterial({
      color: 0x758a52,
      shading: THREE.FlatShading,
      roughness: 1,
      metalness: 0,
      side: THREE.DoubleSide
    });
    const geometry = new THREE.PlaneBufferGeometry(2000, 1000, 100, 100);

    const mountains = [new THREE.Mesh(geometry, material)];

    mountains[0].position.set(-2000, 0, 0);
    mountains[0].rotation.set(-Math.PI / 2, 0, -Math.PI / 2);

    // mountains[1].position.set(0, 0, 1000);
    // mountains[1].rotation.set(-Math.PI / 2, 0, 0);

    // mountains[2].position.set(0, 0, -1000);
    // mountains[2].rotation.set(-Math.PI / 2, 0, 0);

    // mountains[3].position.set(1000, 0, 0);
    // mountains[3].rotation.set(-Math.PI / 2, 0, 0);

    // mountains.forEach((mountain) => {
    //   this.scene.add(mountain);
    //   this.addTerrainToPlain(mountain);
    // })
  }

  addTerrainToPlain(mesh) {
    var perlin = new Perlin();
    var peak = 50;
    var smoothing = 500;

    var vertices = mesh.geometry.attributes.position.array;
    for (var i = 0; i <= vertices.length; i += 3) {
      vertices[i + 2] =
        peak *
        perlin.noise(
          (mesh.position.x + vertices[i]) / smoothing,
          (mesh.position.z + vertices[i + 1]) / smoothing
        );
    }

    mesh.geometry.attributes.position.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
  }

  initSky() {
    const geometry = new THREE.SphereGeometry(2200, 10, 10);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00aefa,
      shading: THREE.FlatShading,
      roughness: 1,
      metalness: 0,
      side: THREE.DoubleSide,
    });
    const sphere = new THREE.Mesh(geometry, material);

    this.scene.add(sphere);
  }
}
