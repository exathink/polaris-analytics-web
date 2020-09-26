import React, {useState} from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';

import {ProjectActivitySummaryWidget} from "./activitySummary";
import {ProjectPipelineWidget} from "./pipeline";
import {ProjectFlowMetricsWidget} from "./flowMetrics";
import {ProjectDefectMetricsWidget} from "./defectMetrics";
import {ProjectPipelineFunnelWidget} from "./funnel";
import {ProjectResponseTimeSLAWidget} from "./responseTimeSLA";
import {DimensionCommitsNavigatorWidget, HeaderMetrics} from "../../shared/widgets/accountHierarchy";
import {withViewerContext} from "../../../framework/viewer/viewerContext";

import {ProjectDashboard} from "../projectDashboard";

import {useProjectWorkItemSourcesStateMappings} from "./hooks/useQueryProjectWorkItemsSourceStateMappings";
import {ProjectTraceabilityTrendsWidget} from "../trends/traceability";
import {ProjectFlowMixTrendsWidget} from "../trends/flowMix";
import {Box, Flex} from "reflexbox";
import {Checkbox} from "antd";

const dashboard_id = 'dashboards.activity.projects.newDashboard.instance';


class StateMappingIndex {
  constructor(stateMappings) {
    this.stateMappings = stateMappings;
    this.initIndex(stateMappings)
  }

  initIndex(stateMappings) {
    if (stateMappings != null) {
      this.index = {
        backlog: 0,
        open: 0,
        wip: 0,
        complete: 0,
        closed: 0
      }
      for (let i = 0; i < stateMappings.length; i++) {
        for (let j = 0; j < stateMappings[i].length; j++) {
          this.index[stateMappings[i][j].stateType]++;
        }
      }
    }
  }

  isValid() {
    return this.index != null;
  }

  numInProcessStates() {
    return this.index != null ? this.index.open + this.index.wip + this.index.complete : 0;
  }
}


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

          return (
            <Dashboard dashboard={`${dashboard_id}`}>
              <DashboardRow h='12%'>
                <DashboardWidget
                  w={0.20}
                  name="team"
                  title={'Team'}
                  subtitle={`30 days`}
                  render={
                    () =>
                      <ProjectActivitySummaryWidget
                        instanceKey={key}
                        days={30}
                        latestCommit={latestCommit}
                      />
                  }
                />
                <DashboardWidget
                  w={0.13}
                  name="traceability"
                  title={'Traceability'}
                  subtitle={'30 Days'}
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
                <DashboardWidget
                  w={0.37}
                  name="alignment"
                  title={'Flow Mix'}
                  subtitle={'30 days'}
                  styles={{
                    controlContainer: {
                      width: '27%'
                    }
                  }}
                  controls={
                    [
                      ({view}) => (
                        view !== 'detail' &&
                          <span>{specsOnly ? '% of Effort' : '% of Items'}</span>
                      )
                    ]
                  }

                  render={
                    ({view}) =>
                      <ProjectFlowMixTrendsWidget
                        instanceKey={key}
                        measurementWindow={30}
                        days={7}
                        samplingFrequency={7}
                        context={context}
                        view={view}
                        latestWorkItemEvent={latestWorkItemEvent}
                        latestCommit={latestCommit}
                        specsOnly={specsOnly}
                        asStatistic={true}

                      />
                  }
                  hideTitlesInDetailView={true}
                  showDetail={true}
                />
                <DashboardWidget
                  w={0.20}
                  name="response-time-sla"
                  title={'Response Time'}
                  subtitle={"30 Days"}
                  render={
                    () =>
                      <ProjectResponseTimeSLAWidget
                        instanceKey={key}
                        days={30}
                        leadTimeTarget={leadTimeTarget}
                        cycleTimeTarget={cycleTimeTarget}
                        cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
                        leadTimeConfidenceTarget={leadTimeConfidenceTarget}
                        latestWorkItemEvent={latestWorkItemEvent}
                        specsOnly={specsOnly}
                      />
                  }
                />
                {
                  stateMappingIndex.isValid() &&
                  <DashboardWidget
                    w={0.19}
                    name="defect-metrics"
                    title={"Quality"}
                    subtitle={"30 Days"}
                    hideTitlesInDetailView={true}
                    render={
                      ({view}) =>
                        <ProjectDefectMetricsWidget
                          instanceKey={key}
                          view={view}
                          context={context}
                          latestWorkItemEvent={latestWorkItemEvent}
                          stateMappingIndex={stateMappingIndex}
                          days={30}
                          leadTimeTargetPercentile={leadTimeConfidenceTarget}
                          cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
                        />
                    }
                    showDetail={true}
                  />
                }

              </DashboardRow>


              <DashboardRow h={'28%'}
                            title={' '}
              >
                {
                  stateMappingIndex.isValid() &&
                  <DashboardWidget
                    w={0.29}
                    name="pipeline"
                    title={specsOnly ? "Specs In Progress" : "All Work In Progress"}
                    render={
                      ({view}) =>
                        <ProjectPipelineWidget
                          instanceKey={key}
                          specsOnly={specsOnly}
                          latestWorkItemEvent={latestWorkItemEvent}
                          stateMappingIndex={stateMappingIndex}
                          days={30}
                          targetPercentile={responseTimeConfidenceTarget}
                          leadTimeTargetPercentile={leadTimeConfidenceTarget}
                          cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
                          view={view}
                          context={context}
                        />
                    }
                    showDetail={true}
                    hideTitlesInDetailView={true}
                  />
                }
                <DashboardWidget
                  w={0.36}
                  name="pipeline-funnel"

                  render={
                    ({view}) =>
                      <ProjectPipelineFunnelWidget
                        instanceKey={key}
                        context={context}
                        workItemScope={workItemScope}
                        setWorkItemScope={setWorkItemScope}
                        latestWorkItemEvent={latestWorkItemEvent}
                        latestCommit={latestCommit}
                        days={30}
                        view={view}
                      />
                  }
                  showDetail={true}
                />
                {
                  stateMappingIndex.isValid() &&
                  <DashboardWidget
                    w={0.34}
                    name="flow-metrics"
                    title={"Flow Metrics"}
                    subtitle={"30 Days"}
                    hideTitlesInDetailView={true}
                    render={
                      ({view}) =>
                        <ProjectFlowMetricsWidget
                          instanceKey={key}
                          view={view}
                          context={context}
                          specsOnly={specsOnly}
                          latestWorkItemEvent={latestWorkItemEvent}
                          stateMappingIndex={stateMappingIndex}
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

                }
              </DashboardRow>
              <DashboardRow h={'54%'}
                            title={'Latest Activity'}
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
                        headerMetric={HeaderMetrics.latestCommit}
                        latestWorkItemEvent={latestWorkItemEvent}
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
