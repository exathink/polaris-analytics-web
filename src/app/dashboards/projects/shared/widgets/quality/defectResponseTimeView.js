import React from 'react';
import {DefectResponseTimeChart} from "./defectResponseTimeChart"
import {VizItem, VizRow} from "../../../../shared/containers/layout";

export const DefectResponseTimeView = ({
    flowMetricsTrends,
    measurementPeriod,
    measurementWindow,
    cycleTimeTarget,
    view,
  }) => (
    <VizRow h={1}>
      <VizItem w={1}>
        <DefectResponseTimeChart
          flowMetricsTrends={flowMetricsTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
          cycleTimeTarget={cycleTimeTarget}
          view={view}
        />
      </VizItem>
    </VizRow>
)