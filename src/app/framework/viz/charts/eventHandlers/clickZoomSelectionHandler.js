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
  constructor(config, chart, props) {
    this.config = config;
    this.attachEvents(config);
    this.selecting = null;
    this.zoom = null;
    this.selected = null;
    this.chart = chart;
    this.selectionTriggers = {
      zoom: props.zoomTriggersSelection != null  ? props.zoomTriggersSelection : true,
      series: props.seriesTriggersSelection != null? props.seriesTriggersSelection: true,
    };
    this.zoomClearsSelections = props.zoomClearsSelections != null ? props.zoomClearsSelections : true;
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
    /* This rigmarole is there to work around the "designed" behavior
     of getSelectedPoints(). Inside the selection handler the points returned are the ones
     *before* the selection is made rather than after. See https://github.com/highcharts/highcharts/issues/9099
     * for a discussion.
     *
     * Thus in effect we have to implement the logic that makes this.selected behave as though the current point
     * were selected or deselected by this action based on the previous state of the selections.
     *
     * The goal is to make this.selected match the visual state of the point selections *after* this handler returns.
     * Ideally this should have been as simple as calling this.getSelectedPoints() but alas it is not to be so we have to
     * shim it to make it behave that way inside the handler.
     *
     *
    * */
    const selected = this.getRawChart().getSelectedPoints();
    if (selected.find(point => point === e.point)) {
      if (e.shiftKey || e.metaKey || e.ctrlKey ) {
        return selected.filter(point => point !== e.point);
      } else {
        return [];
      }
    } else if (e.shiftKey || e.metaKey || e.ctrlKey ){
      return [e.point, ...selected];
    } else {
      return [e.point];
    }
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
    const visible = this.getRawChart().series.filter((series) => series.visible);
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
    } else {
      return this.getVisibleZoomedPoints()
    }
  }


  onSelectionChange() {
    this.chart.onSelectionChange(this.showSelected())
  }

}