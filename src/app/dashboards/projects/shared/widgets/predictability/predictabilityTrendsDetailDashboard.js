import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {ProjectPredictabilityTrendsWidget} from "./predictabilityTrendsWidget";
import {
  getTrendsControlBarControls,
  useTrendsControlBarState,
} from "../../../../shared/components/trendingControlBar/trendingControlBar";

const dashboard_id = "dashboards.trends.projects.predictability.trends.detail";

export const PredictabilityTrendsDetailDashboard = ({
  instanceKey,
  targetPercentile,
  measurementPeriod,
  measurementWindow,
  cycleTimeTarget,
  samplingFrequency,
  view,
}) => {
  const [
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange],
  ] = useTrendsControlBarState(measurementPeriod, measurementWindow, samplingFrequency);

  return (
    <Dashboard dashboard={dashboard_id}>
      <DashboardRow
        h={1}
        title={`Predictability Trends`}
        subTitle={`Last ${daysRange} days`}
        controls={getTrendsControlBarControls([
          [daysRange, setDaysRange],
          [measurementWindowRange, setMeasurementWindowRange],
          [frequencyRange, setFrequencyRange],
        ])}
      >
        <DashboardWidget
          w={1}
          name="predictability-trends-detailed"
          render={({view}) => (
            <ProjectPredictabilityTrendsWidget
              instanceKey={instanceKey}
              measurementWindow={measurementWindowRange}
              days={daysRange}
              samplingFrequency={frequencyRange}
              cycleTimeTarget={cycleTimeTarget}
              targetPercentile={targetPercentile}
              view={view}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
};
