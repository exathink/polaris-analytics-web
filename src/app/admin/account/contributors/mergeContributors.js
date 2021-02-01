import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";

const dashboard_id = "dashboards.admin.account.merge-contributors";

const mergeContributors = withViewerContext(({viewerContext}) => (
  <Dashboard dashboard={`${dashboard_id}`}>
    <DashboardRow h={"95%"}>
      <DashboardWidget w={1} render={() => <div>Merge Contributors Workflow</div>} />
    </DashboardRow>
  </Dashboard>
));

export default mergeContributors;
