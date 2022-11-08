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
import {ClearFilters} from "../../../../components/clearFilters/clearFilters";
import {FlowTypeWorkItemType, WorkItemStateTypes, FlowTypeDisplayName, AppTerms} from "../../../../config";
import {getServerDate, i18nDate} from "../../../../../../helpers/utility";
import {useIntl} from "react-intl";
import {CardDetailsWidget} from "../../closed/flowMetrics/dimensionCardDetailsWidget";

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
  const [workItemTypeFilter, setFilter] = React.useState(null);

  const [
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange]
  ] = useTrendsControlBarState(days || 45, measurementWindow || 30, samplingFrequency || 7);

  return (
    <Dashboard id={dashboard_id} gridLayout={true} className="tw-grid tw-grid-cols-3 tw-grid-rows-[10%_40%_10%_40%] tw-p-2">
      <div className="tw-col-start-1 tw-row-start-1 tw-text-2xl tw-text-gray-300">
        <div className="tw-flex tw-justify-start">{specsOnly ? `Cost Analysis, ${AppTerms.specs.display}` : `Allocations, All ${AppTerms.cards.display}`}</div>
        <div className="tw-flex tw-justify-start tw-text-sm">Closed, Last {daysRange} Days</div>
      </div>

      <DashboardRow
        h={"50%"}
        className="tw-col-start-2 tw-col-span-2 tw-row-start-1 tw-text-base"
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
                    display={["Costs", "Allocations"]}
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
          className="tw-row-start-2 tw-col-span-3"
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
              setFilter={setFilter}
            />
          )}
        />
      </DashboardRow>
      <DashboardRow
        h={"50%"}
        className="tw-row-start-3 tw-col-start-3 tw-flex tw-justify-center"
        controls={[
          () =>
            before != null && (
              <div className="tw-mr-2">
                <ClearFilters
                  selectedFilter={`${measurementWindowRange} days ending ${i18nDate(intl, getServerDate(before))}`}
                  selectedMetric={`${FlowTypeDisplayName[workItemTypeFilter]} Closed`}
                  stateType={WorkItemStateTypes.closed}
                  handleClearClick={() => {
                    setBefore?.(undefined);
                    setFilter?.(undefined);
                  }}
                />
              </div>
            ),
        ]}
      >
        <DashboardWidget
          w={1}
          name={"card-details-mix"}
          className="tw-col-start-1 tw-row-start-4 tw-col-span-3"
          render={({view}) => (
            <CardDetailsWidget
              dimension={dimension}
              instanceKey={instanceKey}
              days={measurementWindowRange}
              specsOnly={specsOnly}
              before={before}
              initialDays={daysRange}
              includeSubTasks={includeSubTasks}
              latestWorkItemEvent={latestWorkItemEvent}
              view={view}
              context={context}
              supportsFilterOnCard={true}
              workItemTypeFilter={FlowTypeWorkItemType[workItemTypeFilter]}
            />
          )}
        />
      </DashboardRow>
    </Dashboard>
  );
}