import React from "react";
import {i18nDate, i18nNumber} from "../../../../../helpers/utility";
import {MeasurementTrendLineChart} from "../../../../shared/views/measurementTrend/measurementTrendLineChart";

export const DefectArrivalCloseRateChart = ({flowRateTrends, measurementPeriod, measurementWindow, view}) => {
  return (
    <MeasurementTrendLineChart
      measurements={flowRateTrends}
      metrics={[
        {key: "arrivalRate", displayName: "Arrival Rate", visible: true, type: "spline"},
        {key: "closeRate", displayName: "Close Rate", visible: true, type: "spline"},
      ]}
      measurementPeriod={measurementPeriod}
      measurementWindow={measurementWindow}
      config={{
        title: "Arrival Rate/Close Rate",
        yAxisUom: "Cards",
        tooltip: {
          formatter: (measurement, seriesKey, intl) => ({
            header: `${measurementWindow} days ending ${i18nDate(intl, measurement.measurementDate)}`,
            body:
              seriesKey === "arrivalRate"
                ? [["Defects Opened: ", `${i18nNumber(intl, measurement.arrivalRate)}`]]
                : [["Defects Closed: ", `${i18nNumber(intl, measurement.closeRate)}`]],
          }),
        },
      }}
    />
  );
};
