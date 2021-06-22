import React from "react";
import {injectIntl} from "react-intl";
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";

const dashboard_id = "dashboards.contributors.manage.manage-teams";

function ManageTeams({context, intl}) {
//   const organizationKey = context.getInstanceKey('organization');
//   const props = {organizationKey, context, intl};

  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h={"95%"}>
        <DashboardWidget w={1} render={() => <div>"Manage Teams Workflow"</div>} />
      </DashboardRow>
    </Dashboard>
  );
}

export default withNavigationContext(injectIntl(ManageTeams));
