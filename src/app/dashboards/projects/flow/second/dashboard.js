import React from "react";
import {ProjectDashboard} from "../../projectDashboard";
import { DashboardWidget , Dashboard, DashboardRow} from "../../../../framework/viz/dashboard";
import { DimensionCommitHistoryWidget } from "../../../shared/widgets/accountHierarchy";

export const dashboard = () => (
  <ProjectDashboard
    pollInterval={60 * 1000}
    render={({project, context}) => {

      return <Dashboard dashboard={`hshshdghshhs`}>
          <DashboardRow h='100%'>
            <DashboardWidget
              w={1}
              name="cumulative-commit-count"
              render={
                ({view}) =>
                  <DimensionCommitHistoryWidget
                    dimension={'project'}
                    instanceKey={project.key}
                    context={context}
                    view={view}
                    detailViewGroupings={['workItem', 'author', 'repository']}
                    detailViewCommitsGroupBy={'workItem'}
                    referenceDate={project.latestCommit}
                  />
              }
              showDetail={true}
            />
          </DashboardRow>
      </Dashboard>
    }}
  />
);
export default dashboard;
