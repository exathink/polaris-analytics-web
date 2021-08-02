import React from 'react';
import {ResponseTimeTrendsChart} from "./responseTimeTrendsChart"
import {VizItem, VizRow} from "../../../../containers/layout";

export const ResponseTimeTrendsView = ({
    data,
    dimension,
    targetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    measurementPeriod,
    measurementWindow,
    onSelectionChange,
    defaultSeries,
    specsOnly,
    view
  }) => {

    const {cycleMetricsTrends: flowMetricsTrends} = React.useMemo(() => data[dimension], [data, dimension]);

    return <VizRow h={1}>
      <VizItem w={1}>
        <ResponseTimeTrendsChart
          flowMetricsTrends={flowMetricsTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
          leadTimeTarget={leadTimeTarget}
          cycleTimeTarget={cycleTimeTarget}
          targetPercentile={targetPercentile}
          onSelectionChange={onSelectionChange}
          defaultSeries={defaultSeries}
          specsOnly={specsOnly}
          view={view}
        />
      </VizItem>
    </VizRow>
  }

