/*
 * Copyright (c) Exathink, LLC  2016-2024.
 * All rights reserved
 *
 */

import React, {useState} from "react";
import {render} from "react-dom";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import {average, toMoment, max} from "../../../../../helpers/utility";
import {useIntl} from "react-intl";
import {Colors, WorkItemTypeDisplayName} from "../../../../shared/config";
import {Collapse} from "antd";
import {formatDateTime} from "../../../../../i18n";
import {tooltipHtml} from "../../../../../framework/viz/charts";


const Panel = Collapse.Panel;

export function IChart(
  {
    iChartData,
    days,
    movingRangeAverage,
    displayType,
    xAttributeMeta
  }) {

  const intl = useIntl();
  const iChartAverage = average(iChartData, item => item.y);
  const iChartNaturalProcessUpperLimit = iChartAverage + (2.66 * movingRangeAverage);
  const iChartNaturalProcessLowerLimit = iChartAverage - (2.66 * movingRangeAverage);


  const [iChartOptions, setIChartOptions] = useState({
    chart: {
      type: displayType,
      animation: false,
      backgroundColor: Colors.Chart.backgroundColor,
      panning: true,
      panKey: "shift",
      zoomType: "xy"
    },
    title: {
      text: `${xAttributeMeta.display}`
    },
    subtitle: {
      text: `Process Behavior, Last ${days} days`
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Date"
      }
    },
    yAxis: {
      title: {
        text: `${xAttributeMeta.display} (${xAttributeMeta.uom})`
      },
      type: "linear",
      max: Math.max(max(iChartData, item => item.y), iChartNaturalProcessUpperLimit),
      plotLines: [
        {
          color: "green",
          value: iChartAverage,
          dashStyle: "longdashdot",
          width: 1,
          label: {
            text: ` Average: ${intl.formatNumber(iChartAverage)} ${xAttributeMeta.uom}`,
            align: "left",
            verticalAlign: "top"
          }
        },
        {
          color: "red",
          value: iChartNaturalProcessLowerLimit,
          dashStyle: "solid",
          width: 1,
          label: {
            text: ` Natural Lower Process Limit: ${intl.formatNumber(iChartNaturalProcessLowerLimit)} ${xAttributeMeta.uom}`,
            align: "left",
            verticalAlign: "top"
          }
        },
        {
          color: "red",
          value: iChartNaturalProcessUpperLimit,
          dashStyle: "solid",
          width: 1,
          label: {
            text: ` Natural Upper Process Limit: ${intl.formatNumber(iChartNaturalProcessUpperLimit)} ${xAttributeMeta.uom}`,
            align: "left",
            verticalAlign: "top"
          }
        }
      ]
    },

    tooltip: {
      useHTML: true,
      followPointer: false,
      hideDelay: 0,
      formatter: function() {
        return tooltipHtml({
          header: `${intl.formatDate(this.point.date)}`,
          body: [
            [`${xAttributeMeta.display}: `, `${intl.formatNumber(this.point.y)} ${xAttributeMeta.uom}`]
          ]
        });
      }
    },
    series: [{
      showInLegend: false,
      type: displayType,
      data: iChartData
    }],
    credits: {
      enabled: false
    },
    plotOptions: {
      series: {
        animation: false
      }
    },
    time: {
      // Since we are already passing in UTC times we
      // dont need the chart to translate the time to UTC
      // This makes sure the tooltips text matches the timeline
      // on the axis.
      useUTC: false
    }
  });

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={iChartOptions}
      />
    </div>
  );
}

export function MrChart(
  {
    mrChartData,
    movingRangeAverage,
    xAttributeMeta
  }) {

  const intl = useIntl();
  const upperRangeLimit = movingRangeAverage + (3.27 * movingRangeAverage);
  const lowerRangeLimit = movingRangeAverage - (3.27 * movingRangeAverage);

  const [mrChartOptions, setMrChartOptions] = useState({
    chart: {
      type: "line",
      animation: false,
      backgroundColor: Colors.Chart.backgroundColor,
      panning: true,
      panKey: "shift",
      zoomType: "xy"
    },
    title: {
      text: ""
    },
    title: {
      text: "Moving Ranges"
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Date"
      }
    },
    yAxis: {
      title: {
        text: "Moving Range (days)"
      },
      type: "linear",
      max: Math.max(max(mrChartData, item => item.y), upperRangeLimit),
      plotLines: [
        {
          color: "green",
          value: movingRangeAverage,
          dashStyle: "longdashdot",
          width: 1,
          label: {
            text: ` Moving Average ${intl.formatNumber(movingRangeAverage)} days`,
            align: "left",
            verticalAlign: "top"
          }
        },
        {
          color: "red",
          value: lowerRangeLimit,
          dashStyle: "solid",
          width: 1,
          label: {
            text: ` Lower Range Limit ${intl.formatNumber(lowerRangeLimit)} days`,
            align: "left",
            verticalAlign: "top"
          }
        },
        {
          color: "red",
          value: upperRangeLimit,
          dashStyle: "solid",
          width: 1,
          label: {
            text: ` Upper Range Limit ${intl.formatNumber(upperRangeLimit)} days`,
            align: "left",
            verticalAlign: "top"
          }
        }
      ]
    },
    tooltip: {
      useHTML: true,
      followPointer: false,
      hideDelay: 0,
      formatter: function() {
        return tooltipHtml({
          header: `${intl.formatDate(this.point.date)}`,
          body: [
            [`Delta: `, `${intl.formatNumber(this.point.y)} ${xAttributeMeta.uom}`]
          ]
        });
      }
    },
    series: [{
      showInLegend: false,
      data: mrChartData
    }],
    credits: {
      enabled: false
    },
    time: {
      useUTC: false
    }
  });

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={mrChartOptions}
      />
    </div>
  );
}

export function XmRChart(
  {
    data,
    days,
    xAttributeMeta,
    displayType,
    timestampAttribute,
    view
  }) {

  function getIChartData(data, xAttribute, timestampAttribute) {
    return data.filter(
      item => item[xAttribute] != null
    ).map(
      item => {
        const date = toMoment(item[timestampAttribute]);
        return ({
          x: date.valueOf(),
          y: item[xAttribute],
          date: date
        });
      }
    );
  }

  function getMovingRanges(xChartData) {
    const sorted = xChartData.sort(
      (a, b) => a.x - a.y
    );

    return sorted.slice(1).map(
      (current, index) => {
        const previous = sorted[index];
        return ({
          x: current.x,
          y: Math.abs(current.y - previous.y),
          date: current.date
        });
      }
    );
  }

  if (xAttributeMeta != null) {
    const iChartData = getIChartData(data, xAttributeMeta.valueMetric, timestampAttribute);
    const mrChartData = getMovingRanges(iChartData);
    const mrAverage = average(mrChartData, item => item.y);

    return (
      <div>
        <IChart
          displayType={displayType}
          iChartData={iChartData}
          days={days}
          movingRangeAverage={mrAverage}
          xAttributeMeta={xAttributeMeta}
        />
        {view === "detail" &&
          <Collapse>
            <Panel key={"1"} header={"Moving Range Chart"}>
              <MrChart
                mrChartData={mrChartData}
                movingRangeAverage={mrAverage}
                xAttributeMeta={xAttributeMeta}
              />
            </Panel>
          </Collapse>
        }
      </div>
    );
  }

}