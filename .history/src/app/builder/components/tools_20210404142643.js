import Model from "../model/model";
import Field from "../components/field";

// This helper class can be used to create and then place geometry in the scene
export default class Tools {
  constructor(app) {
    this.app = app;
    this.scene = app.cssScene;
    this.selectedField;
    this.selectedBays = [];
    this.data = {
      marked: false,
      differentFields: false,
      type: "",
      show: false,
      intervalHandler: 0,
    };
  }

  // Add to field
  add() {
    const that = this;
    const field = this.selectedField;

    field.add(
      new Model(
        that.app.scene,
        that.app.manager,
        that.app.bayMesh.clone(),
        field.type
      )
    );
  }

  // Marking the objects for Phase 2
  mark() {
    this.selectedBays.forEach((bay) => {
      bay.marked = true;
    });
  }

  // Marking the objects for Phase 1
  unmark() {
    this.selectedBays.forEach((bay) => {
      bay.marked = false;
    });
  }

  // Remove from fields
  remove() {
    this.selectedBays.forEach((bay) => {
      bay.field.remove(bay);
    });
    this.app.deselectAllBays();
  }

  // Copy selected bays from field
  copy() {
    const that = this;
    const bays = that.selectedBays.reverse();
    const field = new Field(that.app.scene, that.selectedField.type, true)(
      [0, 0, 0],
      [Math.PI / 2, 0, 0]
    );

    bays.forEach((bay) => {
      debugger;
      const clonedBay = new Model(
        that.app.scene,
        that.app.manager,
        that.app.bayMesh.clone(),
        field.type,
        {
          dimension: bay.dimension,
          steps: {
            size: bay.stepSize
          }
        }
      );
      clonedBay.obj.size = bay.obj.size;
      clonedBay.obj.position.set(
        bay.obj.position.x,
        bay.obj.position.y,
        bay.obj.position.z
      );
      clonedBay.obj.scale.set(
        bay.obj.scale.x,
        bay.obj.scale.y,
        bay.obj.scale.z
      );

      field.clone(clonedBay);
    });
    this.app.deselectAllBays();
    this.app.fields.push(field);
  }

  // Rotate selected bays
  rotate() {
    this.selectedField.rotate();
  }

  // Add bay duplicates in field
  duplicate() {
    const that = this;
    const field = this.selectedField;
    const bays = this.selectedBays;

    let latestIndex = bays[bays.length - 1].index;

    bays.forEach((bay, index) => {
      const clonedBay = new Model(
        that.app.scene,
        that.app.manager,
        that.app.bayMesh.clone(),
        field.type
      );
      clonedBay.index = latestIndex + index + 1;
      clonedBay.obj.size = bay.obj.size;
      clonedBay.obj.position.set(
        bay.obj.position.x,
        bay.obj.position.y,
        bay.obj.position.z
      );
      clonedBay.obj.scale.set(
        bay.obj.scale.x,
        bay.obj.scale.y,
        bay.obj.scale.z
      );

      field.clone(clonedBay);
    });
  }

  addSection() {
    this.selectedBays.forEach((bay) => {
      bay.addSection();
    });

    this.data.intervalHandler = setInterval(() => {
      this.selectedBays.forEach((bay) => {
        bay.addSection();
      });
    }, 100);
  }

  removeSection() {
    this.selectedBays.forEach((bay) => {
      bay.removeSection();
    });

    this.data.intervalHandler = setInterval(() => {
      this.selectedBays.forEach((bay) => {
        bay.removeSection();
      });
    }, 100);
  }

  mouseup() {
    if (this.data.intervalHandler) {
      clearInterval(this.data.intervalHandler);
      this.data.intervalHandler = null;
    }
  }

  getSelectedBays() {
    const field = this.app.fields.filter((field) => {
      return field.selectedBays.length;
    })[0];

    this.selectedField = field;
    this.selectedBays = this.app.getSelectedBays() || [];
  }

  update() {
    this.getSelectedBays(this.app);

    this.selectedBays.forEach((bay) => {
      this.data.marked = !!bay.marked;
      this.data.differentFields = bay.field.geo.uuid != this.selectedField.geo.uuid;
    });
    this.data.type = this.selectedField && this.selectedField.type;
    this.data.show = !!this.selectedBays.length;
  }
}
