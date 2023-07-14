import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../../framework/viz/dashboard";
import {DimensionFlowMixTrendsWidget} from "./flowMixTrendsWidget";
import {WorkItemScopeSelector} from "../../../../components/workItemScopeSelector/workItemScopeSelector";
import {
  TrendsControlBar,
  useTrendsControlBarState,
} from "../../../../components/trendingControlBar/trendingControlBar";
import {useChildState} from "../../../../../../helpers/hooksUtil";
import {ClearFilters} from "../../../../components/clearFilters/clearFilters";
import {FlowTypeWorkItemType, WorkItemStateTypes, FlowTypeDisplayName, AppTerms} from "../../../../config";
import {getServerDate, i18nDate} from "../../../../../../helpers/utility";
import {useIntl} from "react-intl";
import {CardDetailsWidget} from "../../closed/flowMetrics/dimensionCardDetailsWidget";
import { useQueryParamState } from "../../../../../projects/shared/helper/hooks";

const dashboard_id = "dashboards.projects.trends.flow-mix.detail";

export const DimensionFlowMixTrendsDetailDashboard = ({
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
  includeSubTasks,
}) => {
  const intl = useIntl();
  const [workItemScope, setWorkItemScope] = useChildState(parentWorkItemScope, parentSetWorkItemScope, "specs");
  const specsOnly = workItemScope === "specs";
  const [before, setBefore] = React.useState();
  const [workItemTypeFilter, setFilter] = React.useState(null);
  const {state: {workItemSelectors=[]}} = useQueryParamState();
  const [
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange],
  ] = useTrendsControlBarState(days || 45, measurementWindow || 30, samplingFrequency || 7);

  return (
    <Dashboard
      id={dashboard_id}
      gridLayout={true}
      className="tw-grid tw-grid-cols-4 tw-grid-rows-[10%_40%_8%_42%] tw-p-2"
    >
      <div className="tw-col-start-1 tw-row-start-1 tw-col-span-4 tw-flex tw-items-center tw-gap-2">
        <div className="tw-text-2xl tw-text-gray-300 tw-shrink-0 tw-mr-8">
          <div className="tw-flex tw-justify-start">
            {specsOnly ? `Allocations, ${AppTerms.specs.display}` : `Allocations, All ${AppTerms.cards.display}`}
          </div>
          <div className="tw-flex tw-justify-start tw-text-sm">Closed, Last {daysRange} Days</div>
        </div>

        <div className="tw-ml-auto tw-flex-1">
          <TrendsControlBar
            trendState={[
              [daysRange, setDaysRange],
              [measurementWindowRange, setMeasurementWindowRange],
              [frequencyRange, setFrequencyRange],
            ]}
          />
        </div>

        <div className="tw-shrink-0 tw-text-base tw-mr-12">
          <WorkItemScopeSelector
            display={["Dev Items", "All"]}
            workItemScope={workItemScope}
            setWorkItemScope={setWorkItemScope}
          />
        </div>
      </div>

      <DashboardRow>
        <DashboardWidget
          name={"flow-mix"}
          className="tw-col-span-4 tw-row-start-2"
          render={({view}) => (
            <DimensionFlowMixTrendsWidget
              dimension={dimension}
              instanceKey={instanceKey}
              tags={workItemSelectors}
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
        className="tw-col-start-4 tw-row-start-3 tw-flex tw-justify-end"
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
          name={"card-details-mix"}
          className="tw-col-span-4 tw-col-start-1 tw-row-start-4"
          render={({view}) => (
            <CardDetailsWidget
              dimension={dimension}
              instanceKey={instanceKey}
              tags={workItemSelectors}
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
};
