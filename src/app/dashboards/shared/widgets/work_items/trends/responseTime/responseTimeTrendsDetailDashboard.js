import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../../framework/viz/dashboard";
import {DimensionResponseTimeTrendsWidget} from "./dimensionResponseTimeTrendsWidget";
import {
  getTrendsControlBarControls,
  useTrendsControlBarState
} from "../../../../components/trendingControlBar/trendingControlBar";
import {DimensionDeliveryCycleFlowMetricsWidget} from '../../closed/flowMetrics/dimensionDeliveryCycleFlowMetricsWidget';
import {getTimePeriod} from "../../../../../projects/shared/helper/utils";
import { useQueryParamState } from '../../../../../projects/shared/helper/hooks';

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

const all = ["all"];
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
  const [yAxisScale, setYAxisScale] = React.useState("histogram");
  const [
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange]
  ] = useTrendsControlBarState(days, measurementWindow, samplingFrequency);
  const {state} = useQueryParamState();
  const workItemSelectors = state?.vs?.workItemSelectors??[];

  return (
    <Dashboard
      dashboard={dashboard_id}
      gridLayout={true}
      className="tw-grid tw-grid-rows-[10%,37%,6%,43%] tw-grid-cols-1"
    >
      <DashboardRow
        title={`Flow Time Trends`}
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
          name="response-time-trends"
          className="tw-col-span-1"
          render={
            ({view}) =>
              <DimensionResponseTimeTrendsWidget
                dimension={dimension}
                instanceKey={instanceKey}
                tags={workItemSelectors}
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
                defaultSeries={all}
                includeSubTasks={includeSubTasks}
              />
          }
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow title={getTimePeriod(measurementWindowRange, before)}>
        <DashboardWidget
          name="flow-metrics-delivery-details"
          className="tw-col-span-1"
          render={({view}) => (
            <DimensionDeliveryCycleFlowMetricsWidget
              dimension={dimension}
              instanceKey={instanceKey}
              tags={workItemSelectors}
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