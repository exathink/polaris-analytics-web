import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {ProjectPredictabilityTrendsWidget} from "./predictabilityTrendsWidget";
import {
  getTrendsControlBarControls,
  useTrendsControlBarState,
} from "../../../../shared/components/trendingControlBar/trendingControlBar";
import { ProjectDeliveryCycleFlowMetricsWidget } from "../flowMetrics/projectDeliveryCycleFlowMetricsWidget";
import {getFlowMetricsRowTitle} from "../../helper/utils";

const dashboard_id = "dashboards.trends.projects.predictability.trends.detail";

export const PredictabilityTrendsDetailDashboard = ({
  instanceKey,
  targetPercentile,
  measurementPeriod,
  measurementWindow,
  cycleTimeTarget,
  samplingFrequency,
  leadTimeTarget,
  cycleTimeConfidenceTarget,
  leadTimeConfidenceTarget,
  latestWorkItemEvent,
  view,
  context,
}) => {
  const [before, setBefore] = React.useState();

  const [
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange],
  ] = useTrendsControlBarState(measurementPeriod, measurementWindow, samplingFrequency);

  return (
    <Dashboard dashboard={dashboard_id}>
      <DashboardRow
        h={"40%"}
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
              setBefore={setBefore}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow h="60%" title={getFlowMetricsRowTitle(before)}>
        <DashboardWidget
          w={1}
          name="flow-metrics-delivery-details"
          render={({view}) => (
            <ProjectDeliveryCycleFlowMetricsWidget
              instanceKey={instanceKey}
              specsOnly={true}
              view={view}
              context={context}
              showAll={true}
              latestWorkItemEvent={latestWorkItemEvent}
              days={daysRange}
              before={before}
              initialMetric={"leadTime"}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
};
