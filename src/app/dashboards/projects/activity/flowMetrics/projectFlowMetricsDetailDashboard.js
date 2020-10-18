import React, {useState} from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {ProjectFlowMetricsWidget} from "./projectFlowMetricsWidget";
import {ProjectDeliveryCycleFlowMetricsWidget} from "./projectDeliveryCycleFlowMetricsWidget";
import {DaysRangeSlider} from "../../../shared/components/daysRangeSlider/daysRangeSlider";
import {WorkItemScopeSelector} from "../../shared/components/workItemScopeSelector";
import {Box, Flex} from "reflexbox";
import {ProjectFlowMixTrendsWidget} from "../../trends/flowMix";

const dashboard_id = 'dashboards.activity.projects.cycleMetrics.detail';


export const ProjectFlowMetricsDetailDashboard = (
  {
    instanceKey,
    context,
    latestWorkItemEvent,
    latestCommit,
    stateMappingIndex,
    days,
    targetPercentile,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    cycleTimeTarget,
    leadTimeTarget,

  }) => {
  const [daysRange, setDaysRange] = useState(days || 30)
  const [workItemScope, setWorkItemScope] = useState('specs');
  const specsOnly = workItemScope === 'specs';
  return (
    <Dashboard
      dashboard={dashboard_id}
    >
      <DashboardRow
        h={"30%"}
        title={`${specsOnly? 'Specs' : 'Work Items' } Closed in Last ${daysRange} days`}
        controls={[
          () => (
            <div style={{minWidth: "300px", padding: "15px"}}>
              <Flex align={'center'}>
                <Box pr={2} w={"100%"}>
                  <WorkItemScopeSelector
                    workItemScope={workItemScope}
                    setWorkItemScope={setWorkItemScope}
                  />
                </Box>
              </Flex>
            </div>

          ),
          () =>
            <div style={{minWidth: "500px"}}>
              <DaysRangeSlider initialDays={daysRange} setDaysRange={setDaysRange}/>
            </div>
        ]}
      >
        <DashboardWidget
          w={0.4}
          title={"Flow Metrics"}
          subtitle={`${daysRange} days`}
          name="cycle-metrics-summary-detailed"
          render={
            ({view}) =>
              <ProjectFlowMetricsWidget
                instanceKey={instanceKey}
                specsOnly={specsOnly}
                showAll={true}
                view={view}
                latestWorkItemEvent={latestWorkItemEvent}
                stateMappingIndex={stateMappingIndex}
                days={daysRange}
                measurementWindow={daysRange}
                targetPercentile={targetPercentile}
                leadTimeTargetPercentile={leadTimeTargetPercentile}
                cycleTimeTargetPercentile={cycleTimeTargetPercentile}
                leadTimeTarget={leadTimeTarget}
                cycleTimeTarget={cycleTimeTarget}
              />
          }
          showDetail={false}
        />
        <DashboardWidget
          w={0.37}
          name="alignment"
          title={'Flow Mix'}
          subtitle={`${daysRange} days`}
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
                instanceKey={instanceKey}
                measurementWindow={daysRange}
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
      </DashboardRow>
      <DashboardRow h={"65%"}>
        <DashboardWidget
          w={1}
          name="cycle-metrics-delivery-details"
          render={
            ({view}) =>
              <ProjectDeliveryCycleFlowMetricsWidget
                instanceKey={instanceKey}
                specsOnly={specsOnly}
                view={view}
                context={context}
                showAll={true}
                latestWorkItemEvent={latestWorkItemEvent}
                stateMappingIndex={stateMappingIndex}
                days={daysRange}
                leadTimeTargetPercentile={leadTimeTargetPercentile}
                cycleTimeTargetPercentile={cycleTimeTargetPercentile}
              />
          }
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  )
};