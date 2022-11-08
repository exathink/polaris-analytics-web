import React, {useState} from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../../framework/viz/dashboard";
import {DimensionFlowMetricsWidget} from "./dimensionFlowMetricsWidget";
import {DimensionDeliveryCycleFlowMetricsWidget} from "./dimensionDeliveryCycleFlowMetricsWidget";
import {DaysRangeSlider} from "../../../../components/daysRangeSlider/daysRangeSlider";
import {WorkItemScopeSelector} from "../../../../components/workItemScopeSelector/workItemScopeSelector";
import {Box, Flex} from "reflexbox";
import { AppTerms } from '../../../../config';

const dashboard_id = 'dashboards.activity.projects.cycleMetrics.detail';


export const DimensionFlowMetricsDetailDashboard = (
  {
    dimension,
    instanceKey,
    context,
    latestWorkItemEvent,
    latestCommit,
    days,
    cycleTimeTarget,
    cycleTimeConfidenceTarget,
    leadTimeTarget,
    leadTimeConfidenceTarget,
    includeSubTasks
  }) => {
  const [daysRange, setDaysRange] = useState(days || 30)
  const [workItemScope, setWorkItemScope] = useState('specs');
  const specsOnly = workItemScope === 'specs';
  const [yAxisScale, setYAxisScale] = useState("histogram");
  return (
    <Dashboard
      dashboard={dashboard_id}
    >
      <DashboardRow
        h={"20%"}
        title={`${specsOnly? AppTerms.specs.display : AppTerms.cards.display } Closed in Last ${daysRange} days`}
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
          title={"Flow Metrics"}
          subtitle={`${daysRange} days`}
          name="cycle-metrics-summary-detailed"
          render={
            ({view}) =>
              <DimensionFlowMetricsWidget
                dimension={dimension}
                instanceKey={instanceKey}
                specsOnly={specsOnly}
                display={'all'}
                view={view}
                latestWorkItemEvent={latestWorkItemEvent}
                latestCommit={latestCommit}
                days={daysRange}
                measurementWindow={daysRange}
                leadTimeConfidenceTarget={leadTimeConfidenceTarget}
                cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
                leadTimeTarget={leadTimeTarget}
                cycleTimeTarget={cycleTimeTarget}
                includeSubTasks={includeSubTasks}
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
              <DimensionDeliveryCycleFlowMetricsWidget
                dimension={dimension}
                instanceKey={instanceKey}
                specsOnly={specsOnly}
                view={view}
                context={context}
                showAll={true}
                latestWorkItemEvent={latestWorkItemEvent}

                days={daysRange}
                leadTimeTarget={leadTimeTarget}
                cycleTimeTarget={cycleTimeTarget}
                leadTimeConfidenceTarget={leadTimeConfidenceTarget}
                cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
                yAxisScale={yAxisScale}
                setYAxisScale={setYAxisScale}
                includeSubTasks={includeSubTasks}
              />
          }
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  )
};