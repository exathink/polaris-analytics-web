import React, {useState} from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';

import {ProjectActivitySummaryWidget} from "./activitySummary";
import {ProjectPipelineWidget} from "./pipeline";
import {ProjectFlowMetricsWidget} from "./flowMetrics";
import {ProjectDefectMetricsWidget} from "./defectMetrics";
import {ProjectPipelineFunnelWidget} from "./funnel";
import {ProjectPredictabilityWidget} from "./predictability";
import {DimensionCommitsNavigatorWidget} from "../../shared/widgets/accountHierarchy";


import {withViewerContext} from "../../../framework/viewer/viewerContext";

import {ProjectDashboard} from "../projectDashboard";

import {useProjectWorkItemSourcesStateMappings} from "./hooks/useQueryProjectWorkItemsSourceStateMappings";

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
              <DashboardRow h='15%'>
                <DashboardWidget
                  w={0.28}
                  name="activity-summary"
                  title={specsOnly? 'Spec Activity' : 'Activity'}
                  subtitle={`Last 30 days`}
                  render={
                    () =>
                      <ProjectActivitySummaryWidget
                        instanceKey={key}
                        days={30}
                        specsOnly={specsOnly}
                      />
                  }
                />
                <DashboardWidget
                  w={0.33}
                  name="alignment"
                  title={'Alignment'}
                  render={
                    () => null
                  }
                />
                <DashboardWidget
                  w={0.20}
                  name="predictability"
                  title={'Predictability'}
                  subtitle={"Last 30 Days"}
                  render={
                    () =>
                      <ProjectPredictabilityWidget
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
                    subtitle={"Last 30 Days"}
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


              <DashboardRow h={'25%'}
                            title={' '}
              >
                {
                  stateMappingIndex.isValid() &&
                  <DashboardWidget
                    w={1 / 3}
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
                  w={1 / 3}
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
                  w={1/3}
                  name="flow-metrics"
                  title={"Flow Metrics"}
                  subtitle={"Closed Last 30 Days"}
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
              <DashboardRow h={'55%'}
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
