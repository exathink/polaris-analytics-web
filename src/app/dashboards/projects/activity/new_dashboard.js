import React, {useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {WorkItemStateTypes} from "../../shared/config";
import {ProjectActivitySummaryWidget} from "./activitySummary";
import {ProjectPipelineCycleTimeLatencyWidget, ProjectPipelineWidget} from "./pipeline";
import {ProjectFlowMetricsWidget} from "./flowMetrics";
import {ProjectDefectMetricsWidget} from "./defectMetrics";

import {DimensionCommitsNavigatorWidget} from "../../shared/widgets/accountHierarchy";


import {withViewerContext} from "../../../framework/viewer/viewerContext";

import {ProjectDashboard} from "../projectDashboard";

import {useProjectWorkItemSourcesStateMappings} from "./hooks/useQueryProjectWorkItemsSourceStateMappings";
import {ProjectPipelineFunnelWidget} from "./funnel";

const dashboard_id = 'dashboards.activity.projects.newDashboard.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Activity Overview'/>
};

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
           latestCommit
         },
         context
       }) => {

        const stateMappingIndex = new StateMappingIndex(useProjectWorkItemSourcesStateMappings(key));
        const [workItemScope, setWorkItemScope] = useState('specs');
        const specsOnly = workItemScope === 'specs';

        return (
          <Dashboard dashboard={`${dashboard_id}`}>
            <DashboardRow h='15%'>
              <DashboardWidget
                w={0.25}
                name="activity-summary"
                title={messages.topRowTitle}
                render={
                  () =>
                    <ProjectActivitySummaryWidget
                      instanceKey={key}
                      latestCommit={latestCommit}
                      days={30}
                    />
                }
              />
              {
                stateMappingIndex.isValid() &&
                <DashboardWidget
                  w={stateMappingIndex.numInProcessStates() > 0 ? 0.3 : 0.20}
                  name="pipeline"
                  title={"Work In Progress"}
                  render={
                    ({view}) =>
                      <ProjectPipelineWidget
                        instanceKey={key}
                        latestWorkItemEvent={latestWorkItemEvent}
                        stateMappingIndex={stateMappingIndex}
                        days={30}
                        targetPercentile={0.70}
                        view={view}
                        specsOnly={specsOnly}
                        context={context}
                      />
                  }
                  showDetail={true}
                  hideTitlesInDetailView={true}
                />
              }
              {
                stateMappingIndex.isValid() &&
                <DashboardWidget
                  w={stateMappingIndex.numInProcessStates() > 0 ? 0.35 : 0.35}
                  name="flow-metrics"
                  title={"Closed"}
                  subtitle={"Last 30 Days"}
                  hideTitlesInDetailView={true}
                  render={
                    ({view}) =>
                      <ProjectFlowMetricsWidget
                        instanceKey={key}
                        view={view}
                        context={context}
                        latestWorkItemEvent={latestWorkItemEvent}
                        stateMappingIndex={stateMappingIndex}
                        specsOnly={specsOnly}
                        days={30}
                        measurementWindow={30}
                        targetPercentile={0.70}
                      />
                  }
                  showDetail={true}
                />

              }
              {
                stateMappingIndex.isValid() &&
                <DashboardWidget
                  w={stateMappingIndex.numInProcessStates() > 0 ? 0.35 : 0.30}
                  name="defect-metrics"
                  title={"Defect Metrics"}
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
                        targetPercentile={0.70}
                      />
                  }
                  showDetail={true}
                />
              }


            </DashboardRow>
            <DashboardRow h='30%' title={" "}>
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
                        cycleTimeTarget={7}
                        specsOnly={specsOnly}
                        context={context}
                        latestWorkItemEvent={latestWorkItemEvent}
                        targetPercentile={0.70}
                    />
                }
                showDetail={true}
              />
              <DashboardWidget
                w={1 / 3}
                name="pipeline-funnel"

                render={
                  ({view}) =>
                    <ProjectPipelineFunnelWidget
                      instanceKey={key}
                      context={context}
                      latestWorkItemEvent={latestWorkItemEvent}
                      latestCommit={latestCommit}
                      workItemScope={workItemScope}
                      setWorkItemScope={setWorkItemScope}
                      days={30}
                      view={view}
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
                        cycleTimeTarget={15}
                        latencyTarget={1}
                        context={context}
                        latestWorkItemEvent={latestWorkItemEvent}
                        targetPercentile={0.70}
                        specsOnly={specsOnly}
                    />
                }
                showDetail={true}
              />
            </DashboardRow>
            <DashboardRow h={'50%'}
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
