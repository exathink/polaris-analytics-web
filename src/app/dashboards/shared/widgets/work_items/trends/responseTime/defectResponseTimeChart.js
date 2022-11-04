import React from "react";
import {i18nDate, i18nNumber} from "../../../../../../helpers/utility";
import {MeasurementTrendLineChart} from "../../../../views/measurementTrend/measurementTrendLineChart";
import {AppTerms, ResponseTimeMetricsColor} from "../../../../config";

export const DefectResponseTimeChart = ({
  flowMetricsTrends,
  measurementPeriod,
  measurementWindow,
  cycleTimeTarget,
  view,
}) => {
  return (
    <MeasurementTrendLineChart
      measurements={flowMetricsTrends}
      metrics={[
        {key: "avgLeadTime", displayName: "Avg. Lead Time", visible: true, type: "spline", color: ResponseTimeMetricsColor.leadTime},
        {key: "avgCycleTime", displayName: "Avg. Cycle Time", visible: true, type: "spline", color: ResponseTimeMetricsColor.cycleTime},
      ]}
      measurementPeriod={measurementPeriod}
      measurementWindow={measurementWindow}
      config={{
        title: "Defect Response Time",
        yAxisUom: "Days",
        legendText: AppTerms.specs.display,
        plotBands: {
          metric: "avgCycleTime",
        },
        plotLinesY: [
          {
            color: "orange",
            value: cycleTimeTarget,
            dashStyle: "longdashdot",
            width: 1,
            label: {
              text: `T=${cycleTimeTarget}`,
              align: "right",
              verticalAlign: "middle",
            },
            zIndex: 5,
          },
        ],
        tooltip: {
          formatter: (measurement, seriesKey, intl) => ({
            header: `${measurementWindow} days ending ${i18nDate(intl, measurement.measurementDate)}`,
            body:
              seriesKey === "avgLeadTime"
                ? [["Avg Lead Time: ", `${i18nNumber(intl, measurement.avgLeadTime)} days`]]
                : [["Avg Cycle Time: ", `${i18nNumber(intl, measurement.avgCycleTime)} days`]],
          }),
        },
      }}
    />
  );
};
