import { CSS3DObject } from "../utils/CSS3DRenderer.js";

// Controls based on orbit controls
export default class CSSObject {
  constructor(cssScene) {
    this.object = null;
    this.mesh = null;
    this.scene = cssScene;

    return (el, options) => {
      const element = el;
      options.onclick && element.addEventListener("click", options.onclick);

      const object = new CSS3DObject(element);
      options.position && object.position.copy(options.position);
      options.rotation && object.rotation.copy(options.rotation);
      object.scale.set(1, 1, 1);
      this.object = object;
      this.object.drmr = true;

      this.scene.add(object);

      return object;
    };
  }

  init() {}
}
