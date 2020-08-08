import React from 'react';
import {FormattedMessage} from 'react-intl';
import {
  Dashboard,
  DashboardRow,
  DashboardTabPane,
  DashboardTabs,
  DashboardWidget
} from '../../../framework/viz/dashboard';

import {ProjectActivitySummaryWidget} from "./activitySummary";
import {ProjectPipelineWidget} from "./pipeline";
import {ProjectFlowMetricsWidget} from "./flowMetrics";
import {ProjectDefectMetricsWidget} from "./defectMetrics";
import {
  DimensionCommitsNavigatorWidget,
  DimensionMostActiveChildrenWidget
} from "../../shared/widgets/accountHierarchy";


import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {WORK_ITEMS_DETAIL_DASHBOARD} from "../../../../config/featureFlags";
import {Contexts} from "../../../meta";

import {ProjectDashboard} from "../projectDashboard";
import Contributors from "../../contributors/context";

import {useProjectWorkItemSourcesStateMappings} from "./hooks/useQueryProjectWorkItemsSourceStateMappings";
import Repositories from "../../repositories/context";
import WorkItems from "../../work_items/context";
import {ProjectPipelineStateDetailsWidget} from "./pipeline/projectPipelineStateDetailsWidget";

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
                w={0.25}
                name="activity-summary"
                title={messages.topRowTitle}
                render={
                  () =>
                    <ProjectActivitySummaryWidget
                      instanceKey={key}
                    />
                }
              />
              {
                stateMappingIndex.isValid() &&
                <DashboardWidget
                  w={stateMappingIndex.numInProcessStates() > 0 ? 0.3 : 0.20}
                  name="pipeline"
                  title={"Pipeline"}
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
              {
                stateMappingIndex.isValid() &&
                <DashboardWidget
                  w={stateMappingIndex.numInProcessStates() > 0 ? 0.35 : 0.35}
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
            <DashboardRow h='78%'>
              <DashboardTabs
                defaultActiveKey={'queues'}
              >
                <DashboardTabPane tab={'Queues'} key={'queues'}>

                  <DashboardRow h={'93%'}>
                    <DashboardWidget
                      w={1}
                      name="project-pipeline-state-detail-view"
                      render={
                        ({view}) =>
                          <ProjectPipelineStateDetailsWidget
                            instanceKey={key}
                            view={view}
                            context={context}
                            latestWorkItemEvent={latestWorkItemEvent}
                            stateMappingIndex={stateMappingIndex}
                            days={30}
                            targetPercentile={0.7}
                          />
                      }
                      showDetail={true}
                    />
                  </DashboardRow>
                </DashboardTabPane>
                <DashboardTabPane tab={'Active Specs'} key={'build'}>
                  <DashboardRow h={'25%'}>
                    <DashboardWidget
                      w={1 / 3}
                      name="most-active-work-items"
                      render={
                        ({view}) =>
                          <DimensionMostActiveChildrenWidget
                            dimension={'project'}
                            instanceKey={key}
                            childConnection={'recentlyActiveWorkItems'}
                            context={context}
                            childContext={viewerContext.isFeatureFlagActive(WORK_ITEMS_DETAIL_DASHBOARD) ? WorkItems : Contexts.work_items}
                            top={10}
                            latestCommit={latestCommit}
                            days={1}
                            view={view}
                          />
                      }
                      showDetail={true}
                    />
                    <DashboardWidget
                      w={1 / 3}
                      name="most-active-contributors"
                      render={
                        ({view}) =>
                          <DimensionMostActiveChildrenWidget
                            dimension={'project'}
                            instanceKey={key}
                            childConnection={'recentlyActiveContributors'}
                            context={context}
                            childContext={Contributors}
                            top={10}
                            latestCommit={latestCommit}
                            days={1}
                            view={view}
                          />
                      }
                      showDetail={true}
                    />
                    <DashboardWidget
                      w={1 / 3}
                      name="most-active-repositories"
                      render={
                        ({view}) =>
                          <DimensionMostActiveChildrenWidget
                            dimension={'project'}
                            instanceKey={key}
                            childConnection={'recentlyActiveRepositories'}
                            context={context}
                            childContext={Repositories}
                            top={10}
                            latestCommit={latestCommit}
                            days={1}
                            view={view}
                          />
                      }
                      showDetail={true}
                    />
                  </DashboardRow>
                  <DashboardRow h={'65%'}>
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
                </DashboardTabPane>
              </DashboardTabs>
            </DashboardRow>
          </Dashboard>
        )
      }
    }
  />
);
export default withViewerContext(dashboard);
