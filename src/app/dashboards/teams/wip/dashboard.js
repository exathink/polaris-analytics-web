import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {AppTerms, WorkItemStateTypes} from "../../shared/config";

import {withViewerContext} from "../../../framework/viewer/viewerContext";

import {TeamDashboard} from "../teamDashboard";
import {DimensionPipelineCycleTimeLatencyWidget} from "../../shared/widgets/work_items/wip";

import {WorkItemScopeSelector} from "../../shared/components/workItemScopeSelector/workItemScopeSelector";

import {DimensionWipSummaryWidget} from "../../shared/widgets/work_items/wip/cycleTimeLatency/dimensionWipSummaryWidget";
import {getReferenceString, useFeatureFlag} from "../../../helpers/utility";
import {GroupingSelector} from "../../shared/components/groupingSelector/groupingSelector";

import {AGE_LATENCY_ENHANCEMENTS} from "../../../../config/featureFlags";
import {useQueryParamState} from "../../projects/shared/helper/hooks";
import {useLocalStorage} from "../../../helpers/hooksUtil";
import {FlowMetricsTrendsWidget} from "../../projects/shared/widgets/flowMetricsTrends/flowMetricsTrendsWidget";
import classNames from "classnames";
import fontStyles from "../../../framework/styles/fonts.module.css";
import {WIP_CHART_TYPE} from "../../../helpers/localStorageUtils";
import { Checkbox } from "antd";
import { FILTERS } from "../../shared/widgets/work_items/wip/cycleTimeLatency/cycleTimeLatencyUtils";

const dashboard_id = "dashboards.activity.projects.newDashboard.instance";

WipDashboard.videoConfig = {
  url: "https://vimeo.com/501974487/080d487fcf",
  title: "WIP Dashboard",
  VideoDescription: () => (
    <>
      <h2>Wip Dashboard</h2>
      <p> lorem ipsum Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
    </>
  ),
};

function WipDashboard({
  team: {key, latestWorkItemEvent, latestCommit, latestPullRequestEvent, settings, settingsWithDefaults},
  context,
  viewerContext,
}) {
  const [workItemScope, setWorkItemScope] = useState("all");
  const [exclude, setExclude] = React.useState(true);

  const [wip_chart_type_localstorage, setValueToLocalStorage] = useLocalStorage(WIP_CHART_TYPE);
  const [wipChartType, setWipChartType] = useState(wip_chart_type_localstorage || "queue");
  const specsOnly = workItemScope === "specs";

  const updateWipChartType = (value) => {
    setValueToLocalStorage(value);
    setWipChartType(value);
  }

  const ageLatencyFeatureFlag = useFeatureFlag(AGE_LATENCY_ENHANCEMENTS, true);
  const {state: {workItemSelectors=[]}} = useQueryParamState();

  // maintain all filters state over here
  const [appliedFilters, setAppliedFilters] = React.useState(new Map([[FILTERS.EXCLUDE_ABANDONED, {value: [true]}]]));

  const {
    cycleTimeTarget,
    leadTimeTarget,
    responseTimeConfidenceTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    flowAnalysisPeriod,
    includeSubTasksWipInspector,
    latencyTarget,
    trendsAnalysisPeriod,
  } = settingsWithDefaults;

  const DIMENSION = "team";

  return (
    <Dashboard
      dashboard={`${dashboard_id}`}
      dashboardVideoConfig={WipDashboard.videoConfig}
      className="tw-grid tw-grid-cols-6 tw-grid-rows-[8%_auto_72%] tw-gap-x-2 tw-gap-y-1 tw-p-2"
      gridLayout={true}
    >
      <div className="tw-col-span-3 tw-col-start-1 tw-row-start-1 tw-flex tw-items-center tw-text-2xl tw-text-gray-300">
        <div className="tw-flex tw-justify-start">
          {specsOnly ? `All ${AppTerms.specs.display} in Process` : `All ${AppTerms.cards.display} in Process`}
        </div>
      </div>
      <div className="tw-col-span-2 tw-col-start-3 tw-row-start-1 tw-flex tw-flex-col tw-items-center tw-text-2xl tw-text-gray-300">
        <div className="tw-flex tw-justify-start">Age Limit</div>
        <div className="tw-flex tw-justify-start tw-text-base">{cycleTimeTarget} Days</div>
      </div>
      <div className="tw-col-span-3 tw-col-start-4 tw-row-start-1 tw-mr-2 tw-flex tw-items-baseline tw-justify-end tw-gap-8 tw-text-base">
        <div className="tw-self-center tw-text-gray-300">
          <Checkbox
            onChange={(e) => {
              setExclude(e.target.checked);
              if (e.target.checked) {
                setAppliedFilters((prev) => new Map(prev.set(FILTERS.EXCLUDE_ABANDONED, {value: [e.target.checked]})));
              } else {
                setAppliedFilters((prev) => {
                  prev.delete(FILTERS.EXCLUDE_ABANDONED);
                  return new Map(prev);
                });
              }
            }}
            name="state-exclude"
            checked={exclude}
            className="!tw-mb-1 tw-self-end"
          >
            Exclude Abandoned
          </Checkbox>
        </div>

        <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} layout="col" />

        {ageLatencyFeatureFlag && (
          <GroupingSelector
            label="Show"
            value={wipChartType}
            onGroupingChanged={updateWipChartType}
            groupings={[
              {
                key: "queue",
                display: "Where",
              },
              {
                key: "age",
                display: "How long",
              },
              {
                key: "motion",
                display: "Last Moved",
              },
            ]}
            layout="col"
          />
        )}
      </div>
      <DashboardRow>
        <DashboardWidget
          name="summary-wip"
          className="tw-col-span-3 tw-col-start-1"
          title={""}
          render={({view}) => (
            <DimensionWipSummaryWidget
              dimension={DIMENSION}
              instanceKey={key}
              tags={workItemSelectors}
              specsOnly={specsOnly}
              latestCommit={latestCommit}
              displayBag={{excludeAbandoned: exclude}}
              latestWorkItemEvent={latestWorkItemEvent}
              cycleTimeTarget={cycleTimeTarget}
              latencyTarget={latencyTarget}
              targetPercentile={responseTimeConfidenceTarget}
              leadTimeTargetPercentile={leadTimeConfidenceTarget}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
              days={flowAnalysisPeriod}
              view={view}
              includeSubTasks={includeSubTasksWipInspector}
            />
          )}
          showDetail={false}
          hideTitlesInDetailView={true}
        />
        <div className="tw-col-span-3 tw-col-start-4 tw-h-full tw-bg-ghostwhite" data-testid="completed-work">
          <div className="tw-grid tw-grid-cols-2 tw-gap-1">
            <div className={classNames("tw-col-span-2 tw-ml-2 tw-font-normal", fontStyles["text-lg"])}>
              Flow Metrics, Last {flowAnalysisPeriod} Days
            </div>

            <DashboardWidget
              name="throughput-summary-card"
              title=""
              className=""
              render={({view}) => {
                return (
                  <FlowMetricsTrendsWidget
                    dimension={DIMENSION}
                    instanceKey={key}
                    tags={workItemSelectors}
                    // Summary Card Data
                    // Throughput for a single measurement period
                    // There will always be 2 data points in this trend, the trend value compares the difference between the first and the second data point
                    // days = measurementWindow = samplingFrequency
                    // days is set to flowAnalysisPeriod by default
                    days={flowAnalysisPeriod}
                    measurementWindow={flowAnalysisPeriod}
                    samplingFrequency={flowAnalysisPeriod}
                    trendAnalysisPeriod={trendsAnalysisPeriod}
                    flowAnalysisPeriod={flowAnalysisPeriod}
                    targetPercentile={responseTimeConfidenceTarget}
                    specsOnly={specsOnly}
                    latestCommit={latestCommit}
                    latestWorkItemEvent={latestWorkItemEvent}
                    includeSubTasks={includeSubTasksWipInspector}
                    view={view}
                    displayBag={{
                      metric: "volumeWithThroughput",
                      displayType: "cardAdvanced",
                      iconsShiftLeft: false,
                      trendValueClass: "tw-text-2xl",
                    }}
                  />
                );
              }}
            />

            <DashboardWidget
              name="cycletime-summary"
              title=""
              className=""
              render={({view}) => {
                return (
                  <FlowMetricsTrendsWidget
                    key={specsOnly}
                    dimension={DIMENSION}
                    instanceKey={key}
                    tags={workItemSelectors}
                    days={flowAnalysisPeriod}
                    measurementWindow={flowAnalysisPeriod}
                    samplingFrequency={flowAnalysisPeriod}
                    trendAnalysisPeriod={trendsAnalysisPeriod}
                    flowAnalysisPeriod={flowAnalysisPeriod}
                    targetPercentile={responseTimeConfidenceTarget}
                    specsOnly={specsOnly}
                    latestCommit={latestCommit}
                    latestWorkItemEvent={latestWorkItemEvent}
                    includeSubTasks={includeSubTasksWipInspector}
                    cycleTimeTarget={cycleTimeTarget}
                    displayBag={{metric: "cycleTime", displayType: "cardAdvanced", trendValueClass: "tw-text-2xl"}}
                  />
                );
              }}
              showDetail={false}
            />
          </div>
        </div>
      </DashboardRow>
      <DashboardRow title={" "}>
        <DashboardWidget
          name="engineering"
          className="tw-col-span-3 tw-col-start-1 tw-row-start-3"
          render={({view}) => (
            <DimensionPipelineCycleTimeLatencyWidget
              queryVars={{
                dimension: DIMENSION,
                key,
                tags: workItemSelectors,
                specsOnly,
                activeOnly: true,
                includeSubTasks: includeSubTasksWipInspector,
                latestWorkItemEvent,
                latestCommit
              }}
              stageName="Code"
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
              stateTypes={[WorkItemStateTypes.open, WorkItemStateTypes.make]}
              groupByState={true}
              cycleTimeTarget={cycleTimeTarget}
              latencyTarget={latencyTarget}
              tooltipType="small"
              view={view}
              context={context}
              displayBag={{
                displayType: "FlowEfficiencyCard",
                wipChartType,
                setWipChartType: updateWipChartType,
                appliedFilters,
                setAppliedFilters,
                excludeAbandoned: exclude,
              }}
            />
          )}
          showDetail={true}
        />

        <DashboardWidget
          name="delivery"
          className="tw-col-span-3 tw-col-start-4 tw-row-start-3"
          render={({view}) => (
            <DimensionPipelineCycleTimeLatencyWidget
              queryVars={{
                dimension: DIMENSION,
                key,
                tags: workItemSelectors,
                specsOnly,
                activeOnly: true,
                includeSubTasks: includeSubTasksWipInspector,
                latestWorkItemEvent,
                latestCommit
              }}
              stageName={"Ship"}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
              stateTypes={[WorkItemStateTypes.deliver]}
              groupByState={true}
              cycleTimeTarget={cycleTimeTarget}
              latencyTarget={latencyTarget}
              tooltipType="small"
              view={view}
              context={context}
              displayBag={{
                displayType: "FlowEfficiencyCard",
                wipChartType,
                setWipChartType: updateWipChartType,
                appliedFilters,
                setAppliedFilters,
                excludeAbandoned: exclude,
              }}
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  );
}
export const dashboard = ({viewerContext}) => (
  <TeamDashboard
    pollInterval={1000 * 60}
    render={(props) => <WipDashboard viewerContext={viewerContext} {...props} />}
  />
);
export default withViewerContext(dashboard);
