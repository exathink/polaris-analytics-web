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
import {Colors} from "../../../../shared/config";
import {Collapse} from "antd";


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
    movingRangeAverage
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
            text: ` LRL ${intl.formatNumber(lowerRangeLimit)} days`,
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
            text: ` URL ${intl.formatNumber(upperRangeLimit)} days`,
            align: "left",
            verticalAlign: "top"
          }
        }
      ]
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

  function getIChartData(data, xAttributeMeta, timestampAttribute) {
    return data.filter(
      item => xAttributeMeta.value(item) != null
    ).map(
      item => ({
        x: toMoment(item[timestampAttribute]).valueOf(),
        y: xAttributeMeta.value(item)
      })
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
          y: Math.abs(current.y - previous.y)
        });
      }
    );
  }

  if (xAttributeMeta != null) {
    const iChartData = getIChartData(data, xAttributeMeta, timestampAttribute);
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
              />
            </Panel>
          </Collapse>
        }
      </div>
    );
  }

}