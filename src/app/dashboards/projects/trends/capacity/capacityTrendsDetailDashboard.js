import React, {useState} from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";

import {
  getTrendsControlBarControls,
  useTrendsControlBarState
} from "../../../shared/components/trendingControlBar/trendingControlBar";
import {ProjectCapacityTrendsWidget} from "./capacityTrendsWidget";
import {Box, Flex} from "reflexbox";
import {Checkbox} from "antd";

const dashboard_id = 'dashboards.trends.projects.capacity.detail';

export const ProjectCapacityTrendsDetailDashboard = (
  {
    instanceKey,
    view,
    context,
    latestWorkItemEvent,
    latestCommit,
    days,
    measurementWindow,
    samplingFrequency,
    targetPercentile,
    target,
    asStatistic,
    pollInterval
  }) => {

  const [showContributorDetail, setShowContributorDetail] = useState(true);

  const [
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange]
  ] = useTrendsControlBarState(45, 30, 7);


  return (
    <Dashboard
      dashboard={dashboard_id}
    >
      <DashboardRow
        h={1}
        title={`Capacity Trends`}
        subTitle={`Last ${daysRange} days`}
        controls={[

          ...getTrendsControlBarControls(
            [
              [daysRange, setDaysRange],
              [measurementWindowRange, setMeasurementWindowRange, [1,7,30]],
              [frequencyRange, setFrequencyRange, [1,7,30]]
            ]
          ),
          () => (
            <div style={{padding: "10px", minWidth:'300px', marginLeft: '30px'}}>
              <Flex align={'right'}>
                <Box pr={2} w={"100%"}>
                  <Checkbox
                    enabled={true}
                    checked={showContributorDetail}
                    onChange={e => setShowContributorDetail(e.target.checked)}
                  >
                    Show Contributor Detail
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
              <ProjectCapacityTrendsWidget
                instanceKey={instanceKey}
                view={view}
                showAllTrends={true}
                latestWorkItemEvent={latestWorkItemEvent}
                latestCommit={latestCommit}
                days={daysRange}
                measurementWindow={measurementWindowRange}
                samplingFrequency={frequencyRange}
                showContributorDetail={showContributorDetail}
              />
          }
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
}