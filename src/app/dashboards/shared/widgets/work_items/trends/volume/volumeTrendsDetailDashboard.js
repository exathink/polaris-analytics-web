import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../../framework/viz/dashboard";
import {DimensionVolumeTrendsWidget} from "./dimensionVolumeTrendsWidget";
import {
  getTrendsControlBarControls,
  useTrendsControlBarState,
} from "../../../../components/trendingControlBar/trendingControlBar";
import {DimensionDeliveryCycleFlowMetricsWidget} from "../../closed/flowMetrics/dimensionDeliveryCycleFlowMetricsWidget";
import {getTimePeriod} from "../../../../../projects/shared/helper/utils";
import {GroupingSelector} from "../../../../components/groupingSelector/groupingSelector";

const dashboard_id = "dashboards.trends.projects.throughput.detail";

function getSeriesName(seriesName) {
  const objMap = {
    workItemsInScope: "Cards",
    workItemsWithCommits: "Specs",
  };

  return objMap[seriesName] != null ? objMap[seriesName] : seriesName;
}

export const VolumeTrendsDetailDashboard = ({
  dimension,
  instanceKey,
  view,
  context,
  showAll,
  latestWorkItemEvent,
  days,
  measurementWindow,
  samplingFrequency,
  targetPercentile,
  leadTimeTarget,
  cycleTimeTarget,
  leadTimeConfidenceTarget,
  cycleTimeConfidenceTarget,
  pollInterval,
  includeSubTasks,
  detailDashboardInitialMetric,
  displayProps = {},
}) => {
  const [before, setBefore] = React.useState();
  const [seriesName, setSeriesName] = React.useState("workItemsWithCommits");
  const selectedPointSeries = getSeriesName(seriesName);
  const [yAxisScale, setYAxisScale] = React.useState("histogram");
  const [
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange],
  ] = useTrendsControlBarState(days, measurementWindow, samplingFrequency);

  return (
    <Dashboard dashboard={dashboard_id}>
      <DashboardRow
        h={displayProps.chartOrTable === undefined ? "40%" : "100%"}
        title={displayProps.chartOrTable === undefined ? `Volume Trends` : ` `}
        subTitle={
          displayProps.chartOrTable === undefined
            ? `Last ${displayProps.chartOrTable === undefined ? daysRange : days} days`
            : ` `
        }
        controls={
          displayProps.chartOrTable === undefined
            ? getTrendsControlBarControls([
                [daysRange, setDaysRange],
                [measurementWindowRange, setMeasurementWindowRange],
                [frequencyRange, setFrequencyRange],
              ])
            : [
                () => (
                  <GroupingSelector
                    label={"View"}
                    value={displayProps.tabSelection}
                    groupings={[
                      {
                        key: "volume",
                        display: "Volume",
                      },
                      {
                        key: "table",
                        display: "Card Detail",
                      },
                    ]}
                    initialValue={displayProps.tabSelection}
                    onGroupingChanged={displayProps.setTab}
                  />
                ),
              ]
        }
      >
        {displayProps.tabSelection === undefined || displayProps.tabSelection === "volume" ? (
          <DashboardWidget
            w={1}
            name="cycle-metrics-summary-detailed"
            render={({view}) => (
              <DimensionVolumeTrendsWidget
                dimension={dimension}
                instanceKey={instanceKey}
                view={view}
                setBefore={setBefore}
                setSeriesName={setSeriesName}
                latestWorkItemEvent={latestWorkItemEvent}
                days={displayProps.chartOrTable === undefined ? daysRange : days}
                measurementWindow={displayProps.chartOrTable === undefined ? measurementWindowRange : measurementWindow}
                samplingFrequency={displayProps.chartOrTable === undefined ? frequencyRange : samplingFrequency}
                targetPercentile={targetPercentile}
                includeSubTasks={includeSubTasks}
                tabSelection={displayProps.tabSelection}
                setTab={displayProps.setTab}
              />
            )}
            showDetail={false}
          />
        ) : (
          <DashboardWidget
            w={1}
            name="flow-metrics-delivery-details"
            render={({view}) => (
              <DimensionDeliveryCycleFlowMetricsWidget
                dimension={dimension}
                instanceKey={instanceKey}
                specsOnly={selectedPointSeries === "Specs"}
                view={view}
                context={context}
                showAll={true}
                latestWorkItemEvent={latestWorkItemEvent}
                days={displayProps.chartOrTable === undefined ? measurementWindowRange : measurementWindow}
                before={before}
                initialMetric={detailDashboardInitialMetric || "leadTime"}
                leadTimeTarget={leadTimeTarget}
                cycleTimeTarget={cycleTimeTarget}
                leadTimeConfidenceTarget={leadTimeConfidenceTarget}
                cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
                yAxisScale={yAxisScale}
                setYAxisScale={setYAxisScale}
                includeSubTasks={includeSubTasks}
                chartOrTable={displayProps.chartOrTable}
              />
            )}
            showDetail={false}
          />
        )}
      </DashboardRow>
      {displayProps.tabSelection === undefined && (
        <DashboardRow h="45%" title={getTimePeriod(measurementWindowRange, before)}>
          <DashboardWidget
            w={1}
            name="flow-metrics-delivery-details"
            render={({view}) => (
              <DimensionDeliveryCycleFlowMetricsWidget
                dimension={dimension}
                instanceKey={instanceKey}
                specsOnly={selectedPointSeries === "Specs"}
                view={view}
                context={context}
                showAll={true}
                latestWorkItemEvent={latestWorkItemEvent}
                days={displayProps.chartOrTable === undefined ? measurementWindowRange : measurementWindow}
                before={before}
                initialMetric={detailDashboardInitialMetric || "leadTime"}
                leadTimeTarget={leadTimeTarget}
                cycleTimeTarget={cycleTimeTarget}
                leadTimeConfidenceTarget={leadTimeConfidenceTarget}
                cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
                yAxisScale={yAxisScale}
                setYAxisScale={setYAxisScale}
                includeSubTasks={includeSubTasks}
                chartOrTable={displayProps.chartOrTable}
              />
            )}
            showDetail={false}
          />
        </DashboardRow>
      )}
    </Dashboard>
  );
};
