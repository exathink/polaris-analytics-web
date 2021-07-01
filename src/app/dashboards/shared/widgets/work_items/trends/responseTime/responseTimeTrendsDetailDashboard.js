import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../../framework/viz/dashboard";
import {DimensionResponseTimeTrendsWidget} from "./dimensionResponseTimeTrendsWidget";
import {
  getTrendsControlBarControls,
  useTrendsControlBarState
} from "../../../../components/trendingControlBar/trendingControlBar";
import {DimensionDeliveryCycleFlowMetricsWidget} from '../../../../../projects/shared/widgets/flowMetrics/dimensionDeliveryCycleFlowMetricsWidget';
import {getFlowMetricsRowTitle} from "../../../../../projects/shared/helper/utils";

const dashboard_id = 'dashboards.trends.projects.response-time.detail';

function getSeriesName(seriesName) {
  const objMap = {
    avgCycleTime: "cycleTime",
    avgLeadTime: "leadTime",
    avgLatency: "latency",
    avgDuration: "duration",
    avgEffort: "effort"
  }

  return objMap[seriesName] != null ? objMap[seriesName] : seriesName;
}

export const ResponseTimeTrendsDetailDashboard = (
  {
    dimension,
    instanceKey,
    view,
    context,
    showAll,
    latestWorkItemEvent,
    days,
    measurementWindow,
    samplingFrequency,
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    targetPercentile,
    pollInterval,
    defaultSeries,
    includeSubTasks
  }
) => {
  const [before, setBefore] = React.useState();
  const [seriesName, setSeriesName] = React.useState("cycleTime");
  const selectedPointSeries = getSeriesName(seriesName);
  const [yAxisScale, setYAxisScale] = React.useState("logarithmic");
  const [
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange]
  ] = useTrendsControlBarState(days, measurementWindow, samplingFrequency);

  return (
    <Dashboard
      dashboard={dashboard_id}
    >
      <DashboardRow
        h={"40%"}
        title={`Response Time Trends`}
        subTitle={`Last ${daysRange} days`}
        controls={
          getTrendsControlBarControls(
            [
              [daysRange, setDaysRange],
              [measurementWindowRange, setMeasurementWindowRange],
              [frequencyRange, setFrequencyRange]
            ]
          )
        }
      >
        <DashboardWidget
          w={1}
          name="response-time-trends"
          render={
            ({view}) =>
              <DimensionResponseTimeTrendsWidget
                dimension={dimension}
                instanceKey={instanceKey}
                view={view}
                latestWorkItemEvent={latestWorkItemEvent}
                days={daysRange}
                measurementWindow={measurementWindowRange}
                samplingFrequency={frequencyRange}
                targetPercentile={targetPercentile}
                leadTimeTarget={leadTimeTarget}
                cycleTimeTarget={cycleTimeTarget}
                setBefore={setBefore}
                setSeriesName={setSeriesName}
                defaultSeries={["all"]}
                includeSubTasks={includeSubTasks}
              />
          }
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow h="45%" title={getFlowMetricsRowTitle(measurementWindowRange, before)}>
        <DashboardWidget
          w={1}
          name="flow-metrics-delivery-details"
          render={({view}) => (
            <DimensionDeliveryCycleFlowMetricsWidget
              dimension={dimension}
              instanceKey={instanceKey}
              specsOnly={true}
              view={view}
              context={context}
              showAll={true}
              latestWorkItemEvent={latestWorkItemEvent}
              days={measurementWindowRange}
              before={before}
              initialMetric={selectedPointSeries}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              yAxisScale={yAxisScale}
              setYAxisScale={setYAxisScale}
              includeSubTasks={includeSubTasks}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
}