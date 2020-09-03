import React, {useState} from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {ProjectFlowMetricsWidget} from "./projectFlowMetricsWidget";
import {ProjectDeliveryCycleFlowMetricsWidget} from "./projectDeliveryCycleFlowMetricsWidget";
import {DaysRangeSlider} from "../../../shared/components/daysRangeSlider/daysRangeSlider";
import {WorkItemScopeSelector} from "../../shared/components/workItemScopeSelector";
import {Box, Flex} from "reflexbox";
import {Slider} from "antd";

const dashboard_id = 'dashboards.activity.projects.cycleMetrics.detail';


export const ProjectFlowMetricsDetailDashboard = (
  {
    instanceKey,
    context,
    latestWorkItemEvent,
    stateMappingIndex,
    days,
    targetPercentile

  }) => {
  const [daysRange, setDaysRange] = useState(days || 30)
  const [workItemScope, setWorkItemScope] = useState('specs');
  const specsOnly = workItemScope === 'specs';
  return (
    <Dashboard
      dashboard={dashboard_id}
    >
      <DashboardRow
        h={"20%"}
        title={`Flow Metrics`}
        subTitle={`Last ${daysRange} days`}
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
          w={1}
          name="cycle-metrics-summary-detailed"
          render={
            ({view}) =>
              <ProjectFlowMetricsWidget
                instanceKey={instanceKey}
                specsOnly={specsOnly}
                view={view}
                showAll={true}
                latestWorkItemEvent={latestWorkItemEvent}
                stateMappingIndex={stateMappingIndex}
                days={daysRange}
                measurementWindow={daysRange}
                targetPercentile={targetPercentile}
              />
          }
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow h={"75%"}>
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
                targetPercentile={targetPercentile}
              />
          }
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  )
};