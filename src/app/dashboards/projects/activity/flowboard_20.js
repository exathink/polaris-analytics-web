import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';

import {ProjectActivitySummaryWidget} from "./activitySummary";
import {ProjectPipelineWidget} from "./pipeline";
import {ProjectFlowMetricsWidget} from "./flowMetrics";
import {ProjectDefectMetricsWidget} from "./defectMetrics";
import {ProjectPipelineFunnelWidget} from "./funnel";

import {DimensionCommitsNavigatorWidget} from "../../shared/widgets/accountHierarchy";


import {withViewerContext} from "../../../framework/viewer/viewerContext";

import {ProjectDashboard} from "../projectDashboard";

import {useProjectWorkItemSourcesStateMappings} from "./hooks/useQueryProjectWorkItemsSourceStateMappings";

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

        return (
          <Dashboard dashboard={`${dashboard_id}`}>
            <DashboardRow h='15%'>
              <DashboardWidget
                w={1/3}
                name="activity-summary"
                title={messages.topRowTitle}
                render={
                  () =>
                    <ProjectActivitySummaryWidget
                      instanceKey={key}
                    />
                }
              />
              <DashboardWidget
                w={1/3}
                name="predictability"
                title={'Predictability'}
                render={
                  () => null
                }
              />
              {
                stateMappingIndex.isValid() &&
                <DashboardWidget
                  w={1/3}
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
                        targetPercentile={0.70}
                      />
                  }
                  showDetail={true}
                />
              }


            </DashboardRow>


            <DashboardRow h={'25%'}
                          title={'Pipeline'}
            >
              {
                stateMappingIndex.isValid() &&
                <DashboardWidget
                  w={1/3}
                  name="pipeline"
                  title={"Wip"}
                  render={
                    ({view}) =>
                      <ProjectPipelineWidget
                        instanceKey={key}
                        latestWorkItemEvent={latestWorkItemEvent}
                        stateMappingIndex={stateMappingIndex}
                        days={30}
                        targetPercentile={0.70}
                        view={view}
                        context={context}
                      />
                  }
                  showDetail={true}
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
                        days={30}
                        measurementWindow={30}
                        targetPercentile={0.70}
                      />
                  }
                  showDetail={true}
                />

              }
            </DashboardRow>
            <DashboardRow h={'55%'}
                          title={'Most Recent Contributions'}
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
