import React from "react";
import {i18nDate, i18nNumber} from "../../../../../helpers/utility";
import {MeasurementTrendLineChart} from "../../../../shared/views/measurementTrend/measurementTrendLineChart";

export const DefectResponseTimeChart = ({flowMetricsTrends, measurementPeriod, measurementWindow, view}) => {
  return (
    <MeasurementTrendLineChart
      measurements={flowMetricsTrends}
      metrics={[
        {key: "avgLeadTime", displayName: "avgLeadTime", visible: true, type: "spline"},
        {key: "avgCycleTime", displayName: "avgCycleTime", visible: true, type: "spline"},
      ]}
      measurementPeriod={measurementPeriod}
      measurementWindow={measurementWindow}
      config={{
        title: "LeadTime/CycleTime",
        yAxisUom: "days",
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
