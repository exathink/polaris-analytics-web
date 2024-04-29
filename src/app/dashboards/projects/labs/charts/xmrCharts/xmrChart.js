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
    movingRangeAverage,
    displayType
  }) {

  const intl = useIntl();
  const iChartAverage = average(iChartData, item => item.y);
  const iChartNaturalProcessUpperLimit = iChartAverage + (2.66 * movingRangeAverage);
  const iChartNaturalProcessLowerLimit = iChartAverage - (2.66 * movingRangeAverage);

  const [iChartOptions, setIChartOptions] = useState({
    chart: {
      type: "scatter",
      animation: false,
      backgroundColor: Colors.Chart.backgroundColor,
      panning: true,
      panKey: "shift",
      zoomType: "xy"
    },
    title: {
      text: "Cycle Time"
    },
    subtitle: {
      text: "Process Behavior Chart"
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Date"
      }
    },
    yAxis: {
      title: {
        text: "Cycle Time (Days)"
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
            text: ` Avg. CT ${intl.formatNumber(iChartAverage)} days`,
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
            text: ` NLPL ${intl.formatNumber(iChartNaturalProcessLowerLimit)} days`,
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
            text: ` NUPL ${intl.formatNumber(iChartNaturalProcessUpperLimit)} days`,
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
    xAttribute,
    timestampAttribute,
    view
  }) {

  function getIChartData(data, xAttribute, timestampAttribute) {
    return data.filter(
      item => item[xAttribute] != null
    ).map(
      item => ({
        x: toMoment(item[timestampAttribute]).valueOf(),
        y: (item[xAttribute])
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


  const iChartData = getIChartData(data, xAttribute, timestampAttribute);
  const mrChartData = getMovingRanges(iChartData);
  const mrAverage = average(mrChartData, item => item.y);

  return (
    <div>
      <IChart
        iChartData={iChartData}
        movingRangeAverage={mrAverage}
        displayType={"scatter"}
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
  )
    ;


}