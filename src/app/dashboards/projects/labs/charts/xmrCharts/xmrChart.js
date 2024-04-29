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
    xAxis: {
      type: "datetime"
    },
    yAxis: {
      type: "linear",
      max: Math.max(max(iChartData, item => item.y), iChartNaturalProcessUpperLimit),
      plotLines: [
        {
          color: "orange",
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
          dashStyle: "longdashdot",
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
          dashStyle: "longdashdot",
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


export function XmRChart(
  {
    data,
    xAttribute,
    timestampAttribute
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
        return Math.abs(current.y - previous.y);
      }
    );
  }


  const iChartData = getIChartData(data, xAttribute, timestampAttribute);
  const mrChartData = getMovingRanges(iChartData);
  const mrAverage = average(mrChartData, item => item);

  return (
    <div>
      <IChart
        iChartData={iChartData}
        movingRangeAverage={mrAverage}
        displayType={"line"}
      />
    </div>
  );


}