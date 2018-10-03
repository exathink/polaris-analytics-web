import {set} from 'lodash';

/***
 * Behavior Summary:
 *
 * A selection handler that treats click events and zoom events as selections.
 * Either of these actions will trigger an onSelectionChange event and the selected
 * set of points will include any points selected by clicks or all points from visible series
 * within the zoom window.
 *
 * The points in the zoom window take precedence over selected points, so if there are selected points
 * outside the zoom window they are not considered selected after the zoom.
 *
 * All selected points are deselected when any selected point is clicked or the chart background area is clicked.
 *
 *
 */
export class ClickZoomSelectionEventHandler {
  constructor(config, chart) {
    this.config = config;
    this.attachEvents(config);
    this.selecting = null;
    this.zoom = null;
    this.selected = null;
    this.chart = chart
  }



  attachEvents(config){
    set(config, 'chart.events.click', e => this.deselect());
    set(config,'chart.events.selection', e => this.setZoom(e));
    set(config,'plotOptions.series.events.hide', () => this.onSeriesHide());
    set(config, 'plotOptions.series.events.show', () => this.onSeriesShow());

   if(config.series) {
     const series = config.series;
     const self = this;
     for(let i = 0; i < series.length; i++) {
       if(series[i].allowPointSelect) {
         set(series[i], 'point.events.click', function (e) {
           self.pointClicked(e)
         });
       }
     }
   }
   return config;
  }

  getRawChart() {
    return this.chart.chart;
  }



  setZoom (e) {
    if (e.resetSelection) {
      this.zoom = null;
      this.onSelectionChange()
    }
    else {
      this.clearSelections();
      this.zoom = {
        x_min: e.xAxis[0].min,
        x_max: e.xAxis[0].max,
        y_min: e.yAxis[0].min,
        y_max: e.yAxis[0].max
      };

      this.onSelectionChange();
    }
  };

  pointClicked(e) {
    if (!this.selected || !this.selected.find(point => e.point === point)) {
      this.selecting = 'select';
      if (e.shiftKey || e.metaKey || e.ctrlKey) {
        this.selected = [e.point, ...this.selected];
      } else {
        this.selected = [e.point]
      }
    } else {
      this.clearSelections()
    }
    this.onSelectionChange();
  };


  deselect() {
    this.clearSelections();
    this.getRawChart().getSelectedPoints().forEach(point => point.select(false));
    this.onSelectionChange()
  }

  clearSelections() {
    this.selecting = 'deselect';
    this.selected = null;

  }

  onSeriesShow() {
    this.onSelectionChange()

  }

  onSeriesHide() {
    this.onSelectionChange()
  }


  getZoomedPoints() {
    const selected = []
    const zoom = this.zoom;
    const visible = this.getRawChart().series.filter((series) => series.visible);
    for (let i = 0; i < visible.length; i++) {
      let points = visible[i].options.data;
      if (zoom != null) {
        for (let j = 0; j < points.length; j++) {
          let point = points[j];
          if (point.x >= zoom.x_min && point.x <= zoom.x_max && point.y >= zoom.y_min && point.y <= zoom.y_max) {
            selected.push(point);
          }
        }
      } else {
        selected.concat(...points);
      }
    }
    return selected
  }

  showSelected(point) {
    return this.selected || this.getZoomedPoints()
  }

  onSelectionChange(point) {
    this.chart.onSelectionChange(this.showSelected(point))
  }

}