import {set} from 'lodash';

/***
 * Behavior Summary:
 *
 * A selection handler that treats selection events, zoom ad series visibility events as selections.
 * These actions will trigger an onSelectionChange event and the selected
 * set of points will include any points selected by clicks or all points from visible series
 * within the zoom window.
 *
 * All selected points are deselected when any selected point is clicked or the chart background area is clicked.
 *
 *
 */
export class DefaultSelectionEventHandler {
  constructor(config, props) {
    this.config = config;
    this.attachEvents(config);
    this.selecting = null;
    this.zoomEnabled = config.chart.zoomType;
    this.zoom = null;
    this.selected = null;
    this.chart = null;
    this.selectionTriggers = {
      zoom: props.zoomTriggersSelection != null  ? props.zoomTriggersSelection : true,
      series: props.seriesTriggersSelection != null? props.seriesTriggersSelection: true,
    };
    this.zoomClearsSelections = props.zoomClearsSelections != null ? props.zoomClearsSelections : true;
  }

  setChart(chart) {
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
    if(this.selectionTriggers.zoom) {
      if (e.resetSelection) {
        this.zoom = null;
        this.onSelectionChange()
      }
      else {
        if(this.zoomClearsSelections) {
          this.deselect();
        }
        this.zoom = {
          x_min: e.xAxis[0].min,
          x_max: e.xAxis[0].max,
          y_min: e.yAxis[0].min,
          y_max: e.yAxis[0].max
        };

        this.onSelectionChange();
      }
    } else {
      if(this.zoomClearsSelections) {
        this.deselect();
      }
    }
  };

  getSelectedPoints(e) {
    /* per update to highcharts-custom-events 3.0.6 this
    call to getSelectedPoints() should work as expected. So the
    previous hacks to work around it are now taken out.
    leaving shim around it just in case we find something new and
    need to revert to old hacks.
    * */
    return this.getRawChart().getSelectedPoints();

  }
  pointClicked(e) {
    this.selected = this.getSelectedPoints(e);
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
    if(this.selectionTriggers.series) {
      this.onSelectionChange()
    }


  }

  onSeriesHide() {
    if(this.selectionTriggers.series) {
      this.onSelectionChange()
    }
  }

  pointInZoom(point) {
    if(this.zoom) {
      return point.x >= this.zoom.x_min && point.x <= this.zoom.x_max && point.y >= this.zoom.y_min && point.y <= this.zoom.y_max
    } else {
      return true
    }
  }

  getVisibleZoomedPoints() {
    const selected = [];
    const zoom = this.zoom;
    const series = this.getRawChart().series;
    if(series) {
      const visible = series.filter((series) => series.visible);
      for (let i = 0; i < visible.length; i++) {
        let points = visible[i].options.data;
        if (zoom != null) {
          for (let j = 0; j < points.length; j++) {
            let point = points[j];
            if (this.pointInZoom(point)) {
              selected.push(point);
            }
          }
        } else {
          selected.push(...points);
        }
      }
    }
    return selected
  }

  getVisibleSelections() {
    if(this.selected && this.selected.length > 0){
      return this.selected.filter(point => point.series.visible)
    }
  }

  showSelected() {
    const visibleSelections = this.getVisibleSelections();
    if (visibleSelections && visibleSelections.length > 0) {
      return visibleSelections
    } else if(this.zoomEnabled && this.selectionTriggers.zoom) {
      return this.getVisibleZoomedPoints()
    }
    return null;
  }


  onSelectionChange() {
    this.chart.onSelectionChange(this.showSelected())
  }

}