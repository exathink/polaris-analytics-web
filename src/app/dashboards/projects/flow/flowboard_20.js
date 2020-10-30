import React, {useState} from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {WorkItemStateTypes} from "../../shared/config";
import {
  ProjectPipelineCycleTimeLatencyWidget,
  ProjectPipelineImplementationCostWidget,
  ProjectPipelineWidget
} from "./pipeline";

import {DimensionCommitsNavigatorWidget, HeaderMetrics} from "../../shared/widgets/accountHierarchy";


import {withViewerContext} from "../../../framework/viewer/viewerContext";

import {ProjectDashboard} from "../projectDashboard";
import {ProjectTraceabilityTrendsWidget} from "../trends/traceability";
import {ProjectResponseTimeSLAWidget} from "./responseTimeSLA";
import {ProjectFlowMetricsWidget} from "./flowMetrics";
import {useProjectWorkItemSourcesStateMappings} from "./hooks/useQueryProjectWorkItemsSourceStateMappings";
import {StateMappingIndex} from "./new_dashboard";

const dashboard_id = 'dashboards.activity.projects.newDashboard.instance';

export const dashboard = ({viewerContext}) => (
    <ProjectDashboard
      pollInterval={1000 * 60}
      render={
        ({
           project: {
             key,
             latestWorkItemEvent,
             latestCommit,
             settings
           },
           context
         }) => {

          const stateMappingIndex = new StateMappingIndex(useProjectWorkItemSourcesStateMappings(key));
          const [workItemScope, setWorkItemScope] = useState('specs');
          const specsOnly = workItemScope === 'specs';

          const {flowMetricsSettings} = settings;
          const leadTimeTarget = flowMetricsSettings.leadTimeTarget || 30;
          const cycleTimeTarget = flowMetricsSettings.cycleTimeTarget || 7;
          const responseTimeConfidenceTarget = flowMetricsSettings.responseTimeConfidenceTarget || 1.0;
          const leadTimeConfidenceTarget = flowMetricsSettings.leadTimeConfidenceTarget || responseTimeConfidenceTarget;
          const cycleTimeConfidenceTarget = flowMetricsSettings.cycleTimeConfidenceTarget || responseTimeConfidenceTarget;
          const wipLimit = flowMetricsSettings.wipLimit || 20;


          return (
            <Dashboard
              dashboard={`${dashboard_id}`}
            >
              <DashboardRow h='12%'>

                <DashboardWidget
                  w={0.16}
                  name="response-time-sla"
                  title={'Cycle Time'}
                  subtitle={"Last 30 Days"}
                  render={
                    () =>
                      <ProjectResponseTimeSLAWidget
                        instanceKey={key}
                        days={30}
                        metric={'cycleTime'}
                        leadTimeTarget={leadTimeTarget}
                        cycleTimeTarget={cycleTimeTarget}
                        cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
                        leadTimeConfidenceTarget={leadTimeConfidenceTarget}
                        latestWorkItemEvent={latestWorkItemEvent}
                        specsOnly={specsOnly}
                      />
                  }
                />

                <DashboardWidget
                  w={0.25}
                  name="pipeline"
                  title={"Work In Progress"}
                  render={
                    ({view}) =>
                      <ProjectPipelineWidget
                        instanceKey={key}
                        display={'flowboardSummary'}
                        latestCommit={latestCommit}
                        latestWorkItemEvent={latestWorkItemEvent}

                        days={30}
                        targetPercentile={responseTimeConfidenceTarget}
                        leadTimeTargetPercentile={leadTimeConfidenceTarget}
                        cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
                        cycleTimeTarget={cycleTimeTarget}
                        wipLimit={wipLimit}
                        view={view}
                        specsOnly={specsOnly}
                        context={context}
                      />
                  }
                  showDetail={true}
                  hideTitlesInDetailView={true}
                />
                <DashboardWidget
                  w={0.45}
                  name="flow-metrics"
                  title={"Flow Metrics"}
                  subtitle={"Last 30 Days"}
                  hideTitlesInDetailView={true}
                  render={
                    ({view}) =>
                      <ProjectFlowMetricsWidget
                        instanceKey={key}
                        view={view}
                        display={'performanceSummary'}
                        context={context}
                        latestWorkItemEvent={latestWorkItemEvent}
                        stateMappingIndex={stateMappingIndex}
                        specsOnly={specsOnly}
                        days={30}
                        measurementWindow={30}
                        targetPercentile={responseTimeConfidenceTarget}
                        leadTimeTargetPercentile={leadTimeConfidenceTarget}
                        cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
                        leadTimeTarget={leadTimeTarget}
                        cycleTimeTarget={cycleTimeTarget}
                      />
                  }
                  showDetail={true}
                />
                <DashboardWidget
                  w={0.12}
                  name="traceability"
                  title={'Traceability'}
                  hideTitlesInDetailView={'true'}
                  render={
                    ({view}) =>
                      <ProjectTraceabilityTrendsWidget
                        instanceKey={key}
                        measurementWindow={30}
                        days={7}
                        samplingFrequency={7}
                        context={context}
                        view={view}
                        latestWorkItemEvent={latestWorkItemEvent}
                        latestCommit={latestCommit}
                        asStatistic={{title: 'Current'}}
                        target={0.9}
                      />
                  }
                  showDetail={true}
                />

              </DashboardRow>
              <DashboardRow h='33%' title={" "}>
                <DashboardWidget
                  w={1 / 3}
                  name="engineering"
                  render={
                    ({view}) =>
                      <ProjectPipelineCycleTimeLatencyWidget
                        instanceKey={key}
                        view={view}
                        stageName={'Engineering'}
                        stateTypes={[WorkItemStateTypes.open, WorkItemStateTypes.build]}
                        cycleTimeTarget={cycleTimeTarget}
                        specsOnly={specsOnly}
                        workItemScope={workItemScope}
                        setWorkItemScope={setWorkItemScope}
                        context={context}
                        latestWorkItemEvent={latestWorkItemEvent}
                        latestCommit={latestCommit}
                        targetPercentile={cycleTimeConfidenceTarget}
                      />
                  }
                  showDetail={true}
                />
                <DashboardWidget
                  w={1 / 3}
                  name="pipeline-effort"

                  render={
                    ({view}) =>
                      <ProjectPipelineImplementationCostWidget
                        instanceKey={key}
                        view={view}
                        specsOnly={specsOnly}
                        wipLimit={wipLimit}
                        workItemScope={workItemScope}
                        setWorkItemScope={setWorkItemScope}
                        context={context}
                        latestWorkItemEvent={latestWorkItemEvent}
                        latestCommit={latestCommit}
                      />
                  }
                  showDetail={true}
                />
                <DashboardWidget
                  w={1 / 3}
                  name="delivery"
                  render={
                    ({view}) =>
                      <ProjectPipelineCycleTimeLatencyWidget
                        instanceKey={key}
                        view={view}
                        stageName={'Delivery'}

                        stateTypes={[WorkItemStateTypes.deliver]}
                        groupByState={true}
                        cycleTimeTarget={cycleTimeTarget}

                        context={context}
                        latestWorkItemEvent={latestWorkItemEvent}
                        latestCommit={latestCommit}
                        targetPercentile={cycleTimeConfidenceTarget}
                        specsOnly={specsOnly}
                        workItemScope={workItemScope}
                        setWorkItemScope={setWorkItemScope}
                      />
                  }
                  showDetail={true}
                />
              </DashboardRow>
              <DashboardRow h={'48%'}
                            title={'Latest Commits'}
              >
                <DashboardWidget
                  w={1}
                  name="commits"
                  render={
                    ({view}) =>
                      <DimensionCommitsNavigatorWidget
                        dimension={'project'}
                        instanceKey={key}
                        context={context}
                        view={view}
                        days={1}
                        latestCommit={latestCommit}
                        latestWorkItemEvent={latestWorkItemEvent}
                        headerMetric={HeaderMetrics.latestCommit}
                        groupBy={'workItem'}
                        groupings={['workItem', 'author', 'repository', 'branch']}
                        showHeader
                        showTable
                      />
                  }
                  showDetail={true}
                />
              </DashboardRow>
            </Dashboard>
          )
        }
      }
    />
  )
;
export default withViewerContext(dashboard);
