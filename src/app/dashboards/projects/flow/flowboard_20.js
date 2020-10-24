import React, {useState} from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {WorkItemStateTypes} from "../../shared/config";
import {ProjectPipelineCycleTimeLatencyWidget} from "./pipeline";

import {DimensionCommitsNavigatorWidget, HeaderMetrics} from "../../shared/widgets/accountHierarchy";


import {withViewerContext} from "../../../framework/viewer/viewerContext";

import {ProjectDashboard} from "../projectDashboard";
import {ProjectPipelineFunnelWidget} from "./funnel";
import {ProjectCapacityTrendsWidget} from "../trends/capacity";
import {ProjectTraceabilityTrendsWidget} from "../trends/traceability";
import {ProjectResponseTimeSLAWidget} from "./responseTimeSLA";

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
                  w={0.25}
                  name="team"
                  title={'Capacity'}
                  subtitle={`Last 30 days`}
                  render={
                    ({view}) =>
                      <ProjectCapacityTrendsWidget
                        instanceKey={key}
                        measurementWindow={30}
                        days={7}
                        samplingFrequency={7}
                        context={context}
                        view={view}
                        latestWorkItemEvent={latestWorkItemEvent}
                        latestCommit={latestCommit}
                        asStatistic={true}
                        target={0.9}
                      />
                  }
                  showDetail={true}
                  hideTitlesInDetailView={true}
                />
                <DashboardWidget
                  w={0.20}
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
                  w={0.15}
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
                        cycleTimeTarget={cycleTimeTarget}
                        specsOnly={specsOnly}
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
                        cycleTimeTarget={cycleTimeTarget}

                        context={context}
                        latestWorkItemEvent={latestWorkItemEvent}
                        latestCommit={latestCommit}
                        targetPercentile={cycleTimeConfidenceTarget}
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
