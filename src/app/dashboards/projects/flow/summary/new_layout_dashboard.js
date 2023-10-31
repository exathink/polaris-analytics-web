import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {FlowMetricsTrendsWidget} from "../../shared/widgets/flowMetricsTrends/flowMetricsTrendsWidget";
import {ProjectPipelineFunnelWidget} from "../../shared/widgets/funnel";
import {DimensionWipMetricsWidget} from "../../../shared/widgets/work_items/wip/cycleTimeLatency/dimensionWipMetricsWidget";
import {DimensionPipelineQuadrantSummaryWidget} from "../../../shared/widgets/work_items/wip";
import {ProjectDashboard, useProjectContext} from "../../projectDashboard";
import {Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../../../shared/components/workItemScopeSelector/workItemScopeSelector";
import {GroupingSelector} from "../../../shared/components/groupingSelector/groupingSelector";
import {AppTerms, WIP_PHASES} from "../../../shared/config";
import {useQueryParamState} from "../../shared/helper/hooks";
import {Checkbox} from "antd";
import { ProjectTraceabilityTrendsWidget } from "../../../shared/widgets/commits/traceability";
import { StartRateWidget } from "../../shared/widgets/flowMetricsTrends/startRateWidget";

const dashboard_id = "dashboards.activity.projects.newFlow.instance";

export function NewFlowDashboard() {

  const {project: {key, latestWorkItemEvent, latestCommit, settingsWithDefaults}, context} = useProjectContext();

  const [workItemScope, setWorkItemScope] = useState("all");
  const specsOnly = workItemScope === "specs";
  const [volumeOrEffort, setVolumeOrEffort] = useState(workItemScope === "all" ? 'volume' : 'volume');

  const {state} = useQueryParamState();
  const workItemSelectors = state?.vs?.workItemSelectors??[];
  const release = state?.release?.releaseValue;

  const [exclude, setExclude] = React.useState(true);


  React.useEffect(() => {
    if (workItemScope==="all" && volumeOrEffort !== "volume") {
      setVolumeOrEffort("volume")
    }
  }, [workItemScope, volumeOrEffort]);
  
  const {
    responseTimeConfidenceTarget,
    flowAnalysisPeriod,
    trendsAnalysisPeriod,
    includeSubTasksFlowMetrics,
    includeSubTasksWipInspector,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    cycleTimeTarget,
    leadTimeTarget,
    latencyTarget,
    wipLimit,
  } = settingsWithDefaults;

  return (
    <Dashboard
      dashboard={`${dashboard_id}`}
      className="tw-grid tw-grid-cols-8 tw-grid-rows-[8%_20%_52%_20%] tw-gap-2 tw-p-2"
      gridLayout={true}
    >
      <div className="tw-col-span-3 tw-col-start-1 tw-row-start-1 tw-flex tw-items-center tw-gap-8 tw-text-2xl tw-text-gray-300">
        <div>
          <div className="tw-flex tw-justify-start">
            Flow Stability, {specsOnly ? AppTerms.specs.display : `All ${AppTerms.cards.display}`}
          </div>
          <div className="tw-flex tw-justify-start tw-text-sm">Last {flowAnalysisPeriod} Days</div>
        </div>

        <div className="tw-justify-self-end tw-text-gray-300">
          <Checkbox
            onChange={(e) => {
              setExclude(e.target.checked);
            }}
            name="state-exclude"
            checked={exclude}
            style={{alignItems: "center"}}
          >
            <div className="tw-flex tw-flex-col tw-justify-center tw-leading-4">
              <div>Exclude</div>
              <div>Motionless</div>
            </div>
          </Checkbox>
        </div>
      </div>
      <div className="tw-col-span-2 tw-col-start-4 tw-row-start-1 tw-flex tw-flex-col tw-items-center tw-text-2xl tw-text-gray-300">
        <div className="tw-flex tw-justify-start">TimeBox</div>
        <div className="tw-flex tw-justify-start tw-text-base">{cycleTimeTarget} Days</div>
      </div>
      <div className="tw-col-span-3 tw-col-start-6 tw-row-start-1 tw-flex tw-items-center tw-justify-end tw-gap-4 tw-text-base">
        {specsOnly && (
          <Flex align={"center"}>
            <GroupingSelector
              label={"Show"}
              groupings={[
                {
                  key: "volume",
                  display: "Residence Time",
                },
                {
                  key: "effort",
                  display: "Cost",
                },
              ]}
              initialValue={"volume"}
              value={volumeOrEffort}
              onGroupingChanged={(selected) => setVolumeOrEffort(selected)}
            />
          </Flex>
        )}

        <Flex justify={"center"} className="tw-mr-2">
          <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} />
        </Flex>
      </div>
      <DashboardRow>
        <DashboardWidget
          name="start-rate"
          title=""
          className="tw-col-span-2 tw-col-start-2 tw-row-start-2"
          render={({view}) => {
            return (
              <StartRateWidget
                key={specsOnly}
                dimension="project"
                instanceKey={key}
                tags={workItemSelectors}
                release={release}
                days={flowAnalysisPeriod}
                measurementWindow={flowAnalysisPeriod}
                samplingFrequency={flowAnalysisPeriod}
                flowAnalysisPeriod={flowAnalysisPeriod}
                specsOnly={specsOnly}
                latestCommit={latestCommit}
                targetPercentile={responseTimeConfidenceTarget}
                includeSubTasks={includeSubTasksFlowMetrics}
                latestWorkItemEvent={latestWorkItemEvent}
                displayBag={{metric: "startRate", displayType: "cardAdvanced", trendValueClass: "tw-text-2xl"}}
              />
            );
          }}
          showDetail={false}
        />
        <DashboardWidget
          name="wip-volume"
          title=""
          className="tw-col-span-2 tw-col-start-4 tw-row-start-2"
          render={({view}) => {
            return (
              <DimensionWipMetricsWidget
                dimension="project"
                instanceKey={key}
                tags={workItemSelectors}
                release={release}
                targetPercentile={responseTimeConfidenceTarget}
                leadTimeTargetPercentile={leadTimeConfidenceTarget}
                cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
                cycleTimeTarget={cycleTimeTarget}
                latencyTarget={latencyTarget}
                leadTimeTarget={leadTimeTarget}
                specsOnly={specsOnly}
                latestCommit={latestCommit}
                latestWorkItemEvent={latestWorkItemEvent}
                excludeMotionless={exclude}
                includeSubTasks={includeSubTasksWipInspector}
                displayBag={{
                  metric: "volume",
                  displayType: "cardAdvanced",
                  traceabilityStat: <ProjectTraceabilityTrendsWidget
                      instanceKey={key}
                      tags={workItemSelectors}
                      release={release}
                      measurementWindow={flowAnalysisPeriod}
                      days={flowAnalysisPeriod}
                      samplingFrequency={flowAnalysisPeriod}
                      context={context}
                      latestWorkItemEvent={latestWorkItemEvent}
                      latestCommit={latestCommit}
                      displayBag={{displayType: "normStat"}}
                      target={0.9}
                    />,
                  traceability: (
                    <ProjectTraceabilityTrendsWidget
                      instanceKey={key}
                      tags={workItemSelectors}
                      release={release}
                      measurementWindow={flowAnalysisPeriod}
                      days={flowAnalysisPeriod}
                      samplingFrequency={flowAnalysisPeriod}
                      context={context}
                      latestWorkItemEvent={latestWorkItemEvent}
                      latestCommit={latestCommit}
                      displayBag={{displayType: "trendsCompareCard"}}
                      target={0.9}
                    />
                  ),
                }}
                flowAnalysisPeriod={flowAnalysisPeriod}
              />
            );
          }}
          showDetail={false}
        />
        <DashboardWidget
          name="throughput-summary-card"
          title=""
          className="tw-col-span-2 tw-col-start-6 tw-row-start-2 "
          render={({view}) => {
            return (
              <FlowMetricsTrendsWidget
                dimension="project"
                instanceKey={key}
                tags={workItemSelectors}
                release={release}
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
                includeSubTasks={includeSubTasksFlowMetrics}
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
      </DashboardRow>
      <DashboardRow>
        <DashboardWidget
          name="pipeline-funnel-summary"
          className="tw-col-span-4 tw-col-start-3 tw-row-start-3"
          render={({view}) => (
            <ProjectPipelineFunnelWidget
              instanceKey={key}
              tags={workItemSelectors}
              release={release}
              context={context}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              days={flowAnalysisPeriod}
              view={view}
              showVolumeOrEffort={volumeOrEffort}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              latencyTarget={latencyTarget}
              excludeMotionless={exclude}
              includeSubTasks={{
                includeSubTasksInClosedState: includeSubTasksFlowMetrics,
                includeSubTasksInNonClosedState: includeSubTasksWipInspector,
              }}
              displayBag={{
                funnelCenter: ["42%", "50%"],
                title: "Flow, All Phases",
                subTitle: volumeOrEffort === "volume" ? "Residence Time" : "Cost of Unshipped Code",
                series: {dataLabels: {fontSize: "14px"}},
                legend: {title: {fontSize: "14px"}, fontSize: "14px"},
              }}
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
      <DashboardRow>
        <DashboardWidget
          name="wip-age"
          title=""
          className="tw-col-span-2 tw-col-start-1 tw-row-start-4"
          render={({view}) => {
            return (
              <DimensionWipMetricsWidget
                dimension="project"
                instanceKey={key}
                tags={workItemSelectors}
                release={release}
                targetPercentile={responseTimeConfidenceTarget}
                leadTimeTargetPercentile={leadTimeConfidenceTarget}
                cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
                cycleTimeTarget={cycleTimeTarget}
                latencyTarget={latencyTarget}
                specsOnly={specsOnly}
                latestCommit={latestCommit}
                latestWorkItemEvent={latestWorkItemEvent}
                includeSubTasks={includeSubTasksWipInspector}
                excludeMotionless={exclude}
                displayBag={{
                  metric: "avgAge",
                  displayType: "cardAdvanced",
                }}
              />
            );
          }}
          showDetail={false}
        />
        <DashboardWidget
            name="quadrant-summary-pipeline"
            className="tw-col-span-4 tw-col-start-3 tw-row-start-4"
            title={""}
            subtitle={""}
            render={({view}) => (
              <DimensionPipelineQuadrantSummaryWidget
                dimension={"project"}
                instanceKey={key}
                tags={workItemSelectors}
                release={release}
                display={"commonWipSummary"}
                days={flowAnalysisPeriod}
                targetPercentile={responseTimeConfidenceTarget}
                leadTimeTargetPercentile={leadTimeConfidenceTarget}
                cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
                cycleTimeTarget={cycleTimeTarget}
                latencyTarget={latencyTarget}
                wipLimit={wipLimit}
                stateTypes={WIP_PHASES}
                view={view}
                specsOnly={specsOnly}
                workItemScope={workItemScope}
                setWorkItemScope={setWorkItemScope}
                context={context}
                groupByState={true}
                includeSubTasks={includeSubTasksWipInspector}
                latestCommit={latestCommit}
                latestWorkItemEvent={latestWorkItemEvent}
                excludeMotionless={exclude}
                displayBag={{fontSize: "tw-text-xl", showLatencyPopup: true, showQuadrantPopup: true}}
              />
            )}
            showDetail={false}
            hideTitlesInDetailView={true}
          />



        <DashboardWidget
          name="cycletime-summary"
          title=""
          className="tw-col-span-2 tw-col-start-7 tw-row-start-4"
          render={({view}) => {
            return (
              <FlowMetricsTrendsWidget
                key={specsOnly}
                dimension="project"
                instanceKey={key}
                tags={workItemSelectors}
                release={release}
                days={flowAnalysisPeriod}
                measurementWindow={flowAnalysisPeriod}
                samplingFrequency={flowAnalysisPeriod}
                trendAnalysisPeriod={trendsAnalysisPeriod}
                flowAnalysisPeriod={flowAnalysisPeriod}
                targetPercentile={responseTimeConfidenceTarget}
                specsOnly={specsOnly}
                latestCommit={latestCommit}
                latestWorkItemEvent={latestWorkItemEvent}
                includeSubTasks={includeSubTasksFlowMetrics}
                cycleTimeTarget={cycleTimeTarget}
                displayBag={{metric: "cycleTime", displayType: "cardAdvanced", trendValueClass: "tw-text-2xl"}}
              />
            );
          }}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
}

const dashboard = ({viewerContext}) => (
  <ProjectDashboard pollInterval={1000 * 60}>
    <NewFlowDashboard />
  </ProjectDashboard>
);

export default dashboard;
