import * as THREE from "three";

import Config from "../data/config";

// This helper class can be used to create event listeners
export default class InfoBox {
  constructor(app) {
    this.app = app;

    this.data = {
      productionCount: 0,
      technicalCount: 0,
      heatCount: 0,
      heatVolume: 0,
      productionSurface: 0,
      corridorsSurface: 0,
      technicalSurface: 0,
      totalSurface: 0,
      selectedBayLength: 0,
      selectedBayCount: 0,
      selectedBaySurface: 0,
      selectedCorridorLength: 0,
      selectedCorridorSurface: 0,
      selectedHeatHeight: 0,
      selectedHeatRadius: 0,
      selectedHeatVolume: 0,
      selected: {
        type: ''
      }
    }

  }

  productionBayCount() {
    let count = 0;

    this.app.fields.forEach((field) => {
      if (field.type == "production") {
        field.bays.forEach((bay) => {
          count++;
        });
      }
    });

    this.data.productionCount = count;
  }

  technicalBayCount() {
    let count = 0;

    this.app.fields.forEach((field) => {
      if (field.type == "technical") {
        field.bays.forEach((bay) => {
          count++;
        });
      }
    });

    this.data.technicalCount = count;
  }

  heatCount() {
    let count = 0;

    this.app.fields.forEach((field) => {
      if (field.type == "heat") {
        field.bays.forEach((bay) => {
          count++;
        });
      }
    });

    this.data.heatCount = count;
  }

  heatVolume() {
    let count = 0;

    this.app.fields.forEach((field) => {
      if (field.type == "heat") {
        field.bays.forEach((bay) => {
          count += bay.dimension.volume;
        });
      }
    });

    this.data.heatVolume = parseFloat(count).toFixed(2);
  }
  
  productionSurface() {
    let count = 0;

    this.app.fields.forEach((field) => {
      if (field.type == "production") {
        field.bays.forEach((bay) => {
          count += bay.obj.size.x * bay.obj.size.z;
        });
      }
    });

    this.data.productionSurface = parseFloat(count).toFixed(2);
  }

  corridorsSurface() {
    let count = 0;

    this.app.fields.forEach((field) => {
      if (field.type == "corridor") {
        field.bays.forEach((bay) => {
          count += bay.obj.size.x * bay.obj.size.z;
        });
      }
    });

    this.data.corridorsSurface = parseFloat(count).toFixed(2);
  }

  technicalSurface() {
    let count = 0;

    this.app.fields.forEach((field) => {
      if (field.type == "technical") {
        field.bays.forEach((bay) => {
          count += bay.obj.size.x * bay.obj.size.z;
        });
      }
    });

    this.data.technicalSurface = parseFloat(count).toFixed(2);
  }

  totalSurface() {
    this.data.totalSurface = parseFloat(this.data.productionSurface) + parseFloat(this.data.technicalSurface) + parseFloat(this.data.corridorsSurface);
  }

  selectedBayLength() {
    let count = '';

    this.app.selectedElements.forEach((el) => {
      count += parseInt(el.obj.size.x);
    });

    this.data.selectedBayLength = count;
  }

  selectedBayCount() {
    this.data.selectedBayCount = parseInt(this.app.selectedElements.length);
  }

  selectedBaySurface() {
    let count = 0;

    this.app.selectedElements.forEach((bay) => {
      count += bay.obj.size.x * bay.obj.size.z;
    });

    this.data.selectedBaySurface = parseInt(count);
  }

  selectedHeatHeight() {
    this.data.selectedHeatHeight = parseFloat(this.app.selectedElements[0].dimension.height).toFixed(2);
  }

  selectedHeatRadius() {
    this.data.selectedHeatRadius = parseFloat(this.app.selectedElements[0].dimension.width).toFixed(2);
  }

  selectedHeatVolume() {
    this.data.selectedHeatVolume = parseFloat(this.app.selectedElements[0].dimension.volume).toFixed(2);
  }

  selectedCorridorLength() {
    this.data.selectedCorridorLength = parseFloat(this.app.selectedElements[0].obj.size.x).toFixed(2);
  }

  selectedCorridorSurface() {
    let count = 0;

    this.app.selectedElements.forEach((bay) => {
      count += bay.obj.size.x * bay.obj.size.z;
    });

    this.data.selectedCorridorSurface = parseFloat(count).toFixed(2);
  }

  update() {
    this.productionBayCount();
    this.technicalBayCount();
    this.heatCount();
    this.heatVolume();
    this.productionSurface();
    this.corridorsSurface();
    this.technicalSurface();
    this.totalSurface();

    if(this.app.selectedElements && this.app.selectedElements.length) {
      let selectedElements = this.app.selectedElements;
      let type = selectedElements[0].type;

      if(type == 'production' || type == 'technical') {
        type = 'bay';
        
        this.selectedBayLength();
        this.selectedBayCount();
        this.selectedBaySurface();
      } else if(type == 'heat') {
        this.selectedHeatHeight();
        this.selectedHeatRadius();
        this.selectedHeatVolume();
      } else if(type == 'corridor') {
        this.selectedCorridorLength();
        this.selectedCorridorSurface();
      }

      this.data.selected.type = type;
    } else {
      this.data.selected.type = '';
    }
  }
}
