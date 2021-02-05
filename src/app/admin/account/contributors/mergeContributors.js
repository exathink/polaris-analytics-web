import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {MergeContributorsWorkflow} from "./mergeContributorsWorkflow";

const dashboard_id = "dashboards.admin.account.merge-contributors";

export default function MergeContributors() {
  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h={"95%"}>
        <DashboardWidget w={1} render={() => <MergeContributorsWorkflow />} />
      </DashboardRow>
    </Dashboard>
  );
}
