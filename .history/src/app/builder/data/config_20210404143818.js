import TWEEN from '@tweenjs/tween.js';

// This object contains the state of the app
export default {
  isDev: false,
  isShowingStats: false,
  isLoaded: false,
  isTweening: false,
  isRotating: true,
  isMouseMoving: false,
  isMouseOver: false,
  maxAnisotropy: 1,
  dpr: 1,
  easing: TWEEN.Easing.Quadratic.InOut,
  duration: 500,
  model: {
    selected: 0,
    initialTypes: ['gltf'],
    type: 'gltf'
  },
  dimension: {
    production: {
      width: 9.6,
      height: 6.5,
      default: 200,
      min: 25,
      max: 300,
      scale: 100,
    },
    technical: {
      width: 9.6,
      height: 6.5,
      default: 150,
      min: 20,
      max: 400,
      scale: 75,
    },
    corridor: {
      width: 4,
      height: 2,
      default: 50,
      min: 2,
      max: 500,
      scale: 25,
    },
    heat: {
      width: 9.6,
      height: 11,
      volume: 1200
    },
    steps: {
      size: 5
    }
  },
  models: [
    {
      path: './assets/models/bay.gltf',
      type: 'gltf'
    },
  ],
  texture: {
    path: './assets/textures/',
    imageFiles: [
      { name: 'UV', image: 'UV_Grid_Sm.jpg' }
    ]
  },
  mesh: {
    enableHelper: false,
    wireframe: false,
    translucent: false,
    scaleX: 1,
    positionX: 0,
    material: {
      production: {
        selectedColor: 0xa6a9a9,
        color: 0xdadddd,
        emissive: 0x000000
      },
      technical: {
        selectedColor: 0x3263c9,
        color: 0x6799ff,
        emissive: 0x000000
      },
      corridor: {
        selectedColor: 0x575656,
        color: 0x868686,
        emissive: 0x000000
      },
      heat: {
        selectedColor: 0xe33f2e,
        color: 0xff5c4b,
        emissive: 0x000000
      }
    }
  },
  fog: {
    color: 0xffffff,
    near: 0.0008
  },
  camera: {
    fov: 30,
    near: 2,
    far: 4000,
    aspect: 1,
    posX: 445,
    posY: 140,
    posZ: -230
  },
  controls: {
    autoRotate: false,
    autoRotateSpeed: -0.5,
    rotateSpeed: 0.5,
    zoomSpeed: 0.8,
    minDistance: 200,
    maxDistance: 1200,
    minPolarAngle: Math.PI / 10,
    maxPolarAngle: Math.PI / 2.13,
    minAzimuthAngle: -Infinity,
    maxAzimuthAngle: Infinity,
    enableDamping: true,
    dampingFactor: 0.5,
    enableZoom: true,
    target: {
      x: 45,
      y: -19,
      z: 0
    }
  },
  ambientLight: {
    enabled: true,
    color: 0x3e3e3e
  },
  directionalLight: {
    enabled: true,
    color: 0xf0f0f0,
    intensity: 0.47,
    x: 487,
    y: 244,
    z: -307
  },
  shadow: {
    enabled: true,
    helperEnabled: false,
    bias: 0,
    mapWidth: 2048,
    mapHeight: 2048,
    near: 50,
    far: 1500,
    top: 100,
    right: 100,
    bottom: -100,
    left: -100
  },
  pointLight: {
    enabled: true,
    color: 0xffb37e,
    intensity: 0.8,
    distance: 1000,
    x: -153,
    y: 153,
    z: -153
  },
  hemiLight: {
    enabled: true,
    color: 0xc8c8c8,
    groundColor: 0xffffff,
    intensity: 0.76,
    x: -65,
    y: -162,
    z: 0
  }
};
