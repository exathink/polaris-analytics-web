import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {MergeContributorsWorkflow} from "./mergeContributorsWorkflow";

const dashboard_id = "dashboards.admin.account.merge-contributors";

const mergeContributors = withViewerContext(({viewerContext}) => (
  <Dashboard dashboard={`${dashboard_id}`}>
    <DashboardRow h={"95%"}>
      <DashboardWidget w={1} render={() => <MergeContributorsWorkflow />} />
    </DashboardRow>
  </Dashboard>
));

export default mergeContributors;
