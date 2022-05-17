import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../../framework/viz/dashboard";
import {DimensionFlowMixTrendsWidget} from "./flowMixTrendsWidget";
import {Box, Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../../../../components/workItemScopeSelector/workItemScopeSelector";
import {
  getTrendsControlBarControls,
  useTrendsControlBarState,
} from "../../../../components/trendingControlBar/trendingControlBar";
import {useChildState} from "../../../../../../helpers/hooksUtil";
import {DimensionDeliveryCycleFlowMetricsWidget} from "../../../work_items/closed/flowMetrics/dimensionDeliveryCycleFlowMetricsWidget";
import {ClearFilters} from "../../../../components/clearFilters/clearFilters";
import {WorkItemStateTypes} from "../../../../config";
import {getServerDate, i18nDate} from "../../../../../../helpers/utility";
import {useIntl} from "react-intl";

const dashboard_id = "dashboards.projects.trends.flow-mix.detail";

export const DimensionFlowMixTrendsDetailDashboard = (
  {
    dimension,
    instanceKey,
    measurementWindow,
    days,
    samplingFrequency,
    workItemScope: parentWorkItemScope,
    setWorkItemScope: parentSetWorkItemScope,
    context,
    view,
    latestWorkItemEvent,
    latestCommit,
    includeSubTasks

  }
) => {
  const intl = useIntl();
  const [workItemScope, setWorkItemScope] = useChildState(parentWorkItemScope, parentSetWorkItemScope, 'specs');
  const specsOnly = workItemScope === 'specs';
  const [before, setBefore] = React.useState();

  const [
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange]
  ] = useTrendsControlBarState(45, 30, 7);

  return (
    <Dashboard id={dashboard_id}>
      <DashboardRow
        h={"50%"}
        title={`Value Mix Trends`}
        controls={[
          ...getTrendsControlBarControls([
            [daysRange, setDaysRange],
            [measurementWindowRange, setMeasurementWindowRange],
            [frequencyRange, setFrequencyRange],
          ]),
          () => (
            <div style={{minWidth: "220px", padding: "15px"}}>
              <Flex align={"center"}>
                <Box pr={2} w={"100%"}>
                  <WorkItemScopeSelector
                    display={["Capacity", "Volume"]}
                    workItemScope={workItemScope}
                    setWorkItemScope={setWorkItemScope}
                  />
                </Box>
              </Flex>
            </div>
          ),
        ]}
      >
        <DashboardWidget
          w={1}
          name={"flow-mix"}
          render={({view}) => (
            <DimensionFlowMixTrendsWidget
              dimension={dimension}
              instanceKey={instanceKey}
              measurementWindow={measurementWindowRange}
              days={daysRange}
              samplingFrequency={frequencyRange}
              context={context}
              view={view}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              specsOnly={specsOnly}
              asStatistic={false}
              showCounts={true}
              includeSubTasks={includeSubTasks}
              setBefore={setBefore}
            />
          )}
        />
      </DashboardRow>
      <DashboardRow
        h={"50%"}
        title="Card Details"
        controls={[
          () =>
            before != null && (
              <div className="tw-mr-2">
                <ClearFilters
                  selectedFilter={`${measurementWindow} days ending ${i18nDate(intl, getServerDate(before))}`}
                  selectedMetric={"Cards Closed"}
                  stateType={WorkItemStateTypes.closed}
                  handleClearClick={() => {
                    setBefore?.(undefined);
                  }}
                />
              </div>
            ),
        ]}
      >
        <DashboardWidget
          w={1}
          name={"card-details-mix"}
          render={({view}) => (
            <DimensionDeliveryCycleFlowMetricsWidget
              dimension={dimension}
              instanceKey={instanceKey}
              specsOnly={specsOnly}
              view={view}
              context={context}
              showAll={true}
              latestWorkItemEvent={latestWorkItemEvent}
              days={measurementWindowRange}
              before={before}
              initialDays={measurementWindowRange}
              initialMetric={"leadTime"}
              // leadTimeTarget={leadTimeTarget}
              // cycleTimeTarget={cycleTimeTarget}
              // leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              // cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              // yAxisScale={yAxisScale}
              // setYAxisScale={setYAxisScale}
              includeSubTasks={includeSubTasks}
              chartOrTable={"table"}
            />
          )}
        />
      </DashboardRow>
    </Dashboard>
  );
}