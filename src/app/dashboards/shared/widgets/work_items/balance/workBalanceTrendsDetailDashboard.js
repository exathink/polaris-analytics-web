import React, {useState} from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";

import {
  getTrendsControlBarControls,
  useTrendsControlBarState
} from "../../../components/trendingControlBar/trendingControlBar";
import {DimensionWorkBalanceTrendsWidget} from "./dimensionWorkBalanceTrendsWidget";
import {Box, Flex} from "reflexbox";
import {Checkbox} from "antd";

const dashboard_id = 'dashboards.trends.projects.balance.detail';

export const DimensionWorkBalanceTrendsDetailDashboard = (
  {
    dimension,
    instanceKey,
    tags,
    view: parentView,
    context,
    latestWorkItemEvent,
    latestCommit,
    days,
    measurementWindow,
    samplingFrequency,
    targetPercentile,
    target,
    asStatistic,
    showContributorDetail: parentShowContributorDetail = false,
    showEffort: parentShowEffort = false,
    pollInterval,
    includeSubTasks
  }) => {

  const [showContributorDetail, setShowContributorDetail] = useState(true);
  const [showEffort, setShowEffort] = useState(parentShowEffort);

  const [
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange]
  ] = useTrendsControlBarState(days || 45, measurementWindow|| 30, samplingFrequency|| 7);


  return (
    <Dashboard
      dashboard={dashboard_id}
    >
      <DashboardRow
        h={1}
        title={`Work Balance`}
        controls={[

          ...getTrendsControlBarControls(
            [
              [daysRange, setDaysRange],
              [measurementWindowRange, setMeasurementWindowRange, [1,7,30]],
              [frequencyRange, setFrequencyRange, [1,7,30]]
            ]
          ),
          () => (
            <div style={{minWidth:'100px', marginLeft: '10px'}}>
              <Flex align={'right'}>
                <Box pr={2} w={"100%"}>
                  <Checkbox
                    enabled={true}
                    checked={showContributorDetail}
                    onChange={e => setShowContributorDetail(e.target.checked)}
                  >
                    Show Contributors
                  </Checkbox>
                </Box>
              </Flex>
            </div>
          ),
          () => (
            <div style={{minWidth:'100px'}}>
              <Flex align={'right'}>
                <Box pr={1} w={"100%"}>
                  <Checkbox
                    enabled={true}
                    checked={showEffort}
                    onChange={e => setShowEffort(e.target.checked)}
                  >
                    Show Effort
                  </Checkbox>
                </Box>
              </Flex>
            </div>
          ),

          ]
        }
      >
        <DashboardWidget
          w={1}
          name="capacity-trends-detail"
          render={
            ({view}) =>
              <DimensionWorkBalanceTrendsWidget
                context={context}
                dimension={dimension}
                instanceKey={instanceKey}
                tags={tags}
                view={view}
                showAllTrends={true}
                latestWorkItemEvent={latestWorkItemEvent}
                latestCommit={latestCommit}
                days={daysRange}
                measurementWindow={measurementWindowRange}
                samplingFrequency={frequencyRange}
                showContributorDetail={showContributorDetail}
                showEffort={showEffort}
                chartConfig={{totalEffortDisplayType: "areaspline"}}
                includeSubTasks={includeSubTasks}
              />
          }
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
}