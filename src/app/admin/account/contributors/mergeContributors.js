import React from "react";
import {injectIntl} from "react-intl";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {MergeContributorsWorkflow} from "./mergeContributorsWorkflow";

const dashboard_id = "dashboards.admin.account.merge-contributors";

function MergeContributors({viewerContext: {accountKey}, context, intl}) {
  const props = {accountKey, context, intl};
  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h={"95%"}>
        <DashboardWidget w={1} render={() => <MergeContributorsWorkflow {...props} />} />
      </DashboardRow>
    </Dashboard>
  );
}

export default withViewerContext(withNavigationContext(injectIntl(MergeContributors)));
