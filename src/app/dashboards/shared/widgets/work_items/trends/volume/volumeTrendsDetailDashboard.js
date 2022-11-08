import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../../framework/viz/dashboard";
import {DimensionVolumeTrendsWidget} from "./dimensionVolumeTrendsWidget";
import {
  getTrendsControlBarControls,
  useTrendsControlBarState,
} from "../../../../components/trendingControlBar/trendingControlBar";
import {DimensionDeliveryCycleFlowMetricsWidget} from "../../closed/flowMetrics/dimensionDeliveryCycleFlowMetricsWidget";
import {GroupingSelector} from "../../../../components/groupingSelector/groupingSelector";
import {ClearFilters} from "../../../../components/clearFilters/clearFilters";
import {AppTerms, WorkItemStateTypes} from "../../../../config";
import {getServerDate, i18nDate} from "../../../../../../helpers/utility";
import {useResetComponentState} from "../../../../../projects/shared/helper/hooks";
import {useIntl} from "react-intl";

const dashboard_id = "dashboards.trends.projects.throughput.detail";

function getSeriesName(seriesName) {
  const objMap = {
    workItemsInScope: AppTerms.cards.display,
    workItemsWithCommits: AppTerms.specs.display
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
  const [seriesName, setSeriesName] = React.useState("workItemsInScope");
  const selectedPointSeries = getSeriesName(seriesName);
  const [yAxisScale, setYAxisScale] = React.useState("histogram");
  const [resetComponentStateKey, resetComponentState] = useResetComponentState();
  const intl = useIntl()

  function handleClearClick() {
    setSeriesName("workItemsInScope")
    setBefore(undefined);
    resetComponentState();
  }

  const [
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange],
  ] = useTrendsControlBarState(days, measurementWindow, samplingFrequency);

  const specsOnly = selectedPointSeries === AppTerms.specs.display;
  const renderDeliveryCycleFlowMetricsWidget = ({view}) => (
    <DimensionDeliveryCycleFlowMetricsWidget
      dimension={dimension}
      instanceKey={instanceKey}
      specsOnly={specsOnly}
      view={view}
      context={context}
      showAll={true}
      latestWorkItemEvent={latestWorkItemEvent}
      days={
        displayProps.tabSelection !== undefined && displayProps.chartOrTable === "table"
          ? measurementWindow
          : measurementWindowRange
      }
      before={before}
      initialDays={daysRange}
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
  );

  function getClearFilter() {
    const preFilterText = measurementWindowRange===1 ? "on" : `${measurementWindowRange} days ending`;
    return before != null ? (
      <div className="tw-mr-8">
        <ClearFilters
          selectedFilter={ `${preFilterText} ${i18nDate(intl, getServerDate(before))}`}
          selectedMetric={`${specsOnly ? AppTerms.specs.display : AppTerms.cards.display} Closed`}
          stateType={WorkItemStateTypes.closed}
          handleClearClick={handleClearClick}
        />
      </div>
    ) : null;
  }

  return (
    <Dashboard dashboard={dashboard_id}>
      <DashboardRow
        h={displayProps.tabSelection !== undefined && displayProps.chartOrTable === "table" ? "100%" : "40%"}
        title={displayProps.tabSelection !== undefined && displayProps.chartOrTable === "table" ? ` ` : `Volume Trends`}
        subTitle={
          displayProps.tabSelection !== undefined && displayProps.chartOrTable === "table"
            ? ` `
            : `Last ${
                displayProps.tabSelection !== undefined && displayProps.chartOrTable === "table" ? daysRange : days
              } days`
        }
        controls={
          displayProps.tabSelection !== undefined && displayProps.chartOrTable === "table"
            ? [getClearFilter,
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
            : getTrendsControlBarControls([
                [daysRange, setDaysRange],
                [measurementWindowRange, setMeasurementWindowRange],
                [frequencyRange, setFrequencyRange],
              ])
        }
      >
        {displayProps.tabSelection === undefined || displayProps.tabSelection === "volume" ? (
          <DashboardWidget
            key={resetComponentStateKey}
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
                days={
                  displayProps.tabSelection !== undefined && displayProps.chartOrTable === "table" ? days : daysRange
                }
                measurementWindow={
                  displayProps.tabSelection !== undefined && displayProps.chartOrTable === "table"
                    ? measurementWindow
                    : measurementWindowRange
                }
                samplingFrequency={
                  displayProps.tabSelection !== undefined && displayProps.chartOrTable === "table"
                    ? samplingFrequency
                    : frequencyRange
                }
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
            render={renderDeliveryCycleFlowMetricsWidget}
            showDetail={false}
          />
        )}
      </DashboardRow>
      {displayProps.tabSelection === undefined && (
        <DashboardRow
          h="45%"
          title={``}
          controls={[() => <div className="tw-h-12"></div>, getClearFilter]}
        >
          <DashboardWidget
            w={1}
            name="flow-metrics-delivery-details"
            render={renderDeliveryCycleFlowMetricsWidget}
            showDetail={false}
          />
        </DashboardRow>
      )}
    </Dashboard>
  );
};
