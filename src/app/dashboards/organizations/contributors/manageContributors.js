import React from "react";
import {injectIntl} from "react-intl";
import {DimensionManageContributorsWorkflow} from "../../shared/widgets/contributors/manageAliases/dimensionManageContributorsWorkflow";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import styles from "../../../framework/viz/dashboard/dashboardItem.module.css";

const dashboard_id = "dashboards.organizations.contributors.manage-contributors";

function ManageContributors({context, intl}) {
  const organizationKey = context.getInstanceKey("organization");
  const props = {dimension: "organization", instanceKey: organizationKey, context, intl};
  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h={"95%"}>
        <DashboardWidget w={1} className={styles.dashboardItem} render={() => <DimensionManageContributorsWorkflow {...props} />} />
      </DashboardRow>
    </Dashboard>
  );
}

export default withNavigationContext(injectIntl(ManageContributors));
