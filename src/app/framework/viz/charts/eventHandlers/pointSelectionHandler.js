import {set} from 'lodash';

export class PointSelectionEventHandler {
  constructor(config, chart) {
    this.config = config;
    this.attachEvents(config);
    this.selecting = null;
    this.selections = {};
    this.chart = chart
  }



  attachEvents(config){
    set(config,'chart.events.selection', e => this.zoom(e));
    set(config,'plotOptions.series.events.hide', () => this.onSeriesHide());
    set(config, 'plotOptions.series.events.show', () => this.onSeriesShow());

   if(config.series) {
     const series = config.series;
     const self = this;
     for(let i = 0; i < series.length; i++) {
       if(series[i].allowPointSelect) {
         set(series[i], 'point.events.click', function (e) {
           const x = 42;
           self.pointClicked(e)
         });
       }
     }
   }
   this.value = 9;
   return config;
  }

  getRawChart() {
    return this.chart.chart;
  }



  zoom (e) {
    if (e.resetSelection) {
      this.selections['zoom'] = null;
      this.onSelectionChange()
    }
    else {
      this.selections['zoom'] = {
        x_min: e.xAxis[0].min,
        x_max: e.xAxis[0].max,
        y_min: e.yAxis[0].min,
        y_max: e.yAxis[0].max
      };

      this.onSelectionChange();
    }
  };

  pointClicked(e) {
    const selected = this.getRawChart().getSelectedPoints();
    if (!selected.find(point => e.point === point)) {
      this.selecting = 'select';
      if (e.shiftKey) {
        this.selections['selected'] = [e.point, ...selected];
      } else {
        this.selections['selected'] = [e.point]
      }
      this.onSelectionChange()
    } else {
      this.deselect();
    }

  };

  deselect() {
    this.selecting = 'deselect';
    this.selections['selected'] = null;
    this.onSelectionChange();
  }

  onSeriesShow() {
    this.onSelectionChange()

  }

  onSeriesHide() {
    this.onSelectionChange()
  }



  showSelected() {
    if (this.selections['selected'] != null) {
      return this.selections['selected'];
    } else {
      const visible = this.getRawChart().series.filter((series) => series.visible);
      const selected = [];
      const zoom = this.selections['zoom'];
      for (let i = 0; i < visible.length; i++) {
        let points = visible[i].options.data;
        if (zoom != null) {
          for (let j = 0; j < points.length; j++) {
            let point = points[j];
            if (point.x >= zoom.x_min && point.x <= zoom.x_max && point.y >= zoom.y_min && point.y <= zoom.y_max) {
              selected.push(point);
            }
          }
        }
      }
      return selected
    }
  }

  onSelectionChange() {
    this.chart.onSelectionChange(this.showSelected())
  }

}