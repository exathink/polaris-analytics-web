import React, {useState} from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {Box, Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../../shared/components/workItemScopeSelector";
import {Checkbox} from "antd";
import {ProjectTraceabilityTrendsWidget} from "./traceabilityTrendsWidget";
import {DimensionCommitsNavigatorWidget} from "../../../shared/widgets/accountHierarchy";

const dashboard_id = 'dashboards.projects.trends.traceability.detail';

export const ProjectTraceabilityTrendsDetailDashboard = (
  {
    instanceKey,
    context,
    latestWorkItemEvent,
    latestCommit,
    days,
    measurementWindow,
    samplingFrequency,
  }
) => {
  const [excludeMerges, setExcludeMerges] = useState(true);
  return (
    <Dashboard dashboard={dashboard_id}>
      <DashboardRow
        h={"40%"}
        title={"Traceability Trends Details"}
        controls={[
          () => (
            <div style={{padding: "10px"}}>
              <Flex align={'right'}>
                <Box pr={2} w={"100%"}>
                  <Checkbox
                    enabled={true}
                    checked={excludeMerges}
                    onChange={e => setExcludeMerges(e.target.checked)}
                  >
                    Exclude Merges
                  </Checkbox>
                </Box>
              </Flex>
            </div>
          )
        ]}
      >
        <DashboardWidget
          w={1}
          name="traceability"
          render={
            ({view}) =>
              <ProjectTraceabilityTrendsWidget
                instanceKey={instanceKey}
                measurementWindow={measurementWindow}
                days={days}
                samplingFrequency={samplingFrequency}
                context={context}
                latestWorkItemEvent={latestWorkItemEvent}
                latestCommit={latestCommit}
                excludeMerges={excludeMerges}
              />
          }
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow h={"55%"}>
        <DashboardWidget
          w={1}
          name="commits"
          title={"Commits Without Specs"}
          render={
            ({view}) =>
              <DimensionCommitsNavigatorWidget
                dimension={'project'}
                instanceKey={instanceKey}
                context={context}
                view={view}
                days={days}
                nospecsOnly={true}
                latestWorkItemEvent={latestWorkItemEvent}
                groupBy={'author'}
                groupings={['author', 'repository', 'branch']}
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