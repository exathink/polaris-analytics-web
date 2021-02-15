import React from "react";
import {injectIntl} from "react-intl";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {UpdateContributorWorkflow} from "./updateContributorWorkflow";

const dashboard_id = "dashboards.admin.account.update-contributor";

function UpdateContributor({viewerContext: {accountKey}, context, intl}) {
  const props = {accountKey, context, intl};
  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h={"95%"}>
        <DashboardWidget w={1} render={() => <UpdateContributorWorkflow {...props} />} />
      </DashboardRow>
    </Dashboard>
  );
}

export default withViewerContext(withNavigationContext(injectIntl(UpdateContributor)));
