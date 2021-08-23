import React from "react";
import {injectIntl} from "react-intl";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {DimensionManageContributorsWorkflow} from "../../../dashboards/shared/widgets/contributors/manageAliases/dimensionManageContributorsWorkflow";
import styles from "../../../framework/viz/dashboard/dashboardItem.module.css";

const dashboard_id = "dashboards.admin.account.manage-contributors";

function ManageContributors({viewerContext: {accountKey}, context, intl}) {
  const props = {dimension: "account", instanceKey: accountKey, context, intl};
  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h={"95%"}>
        <DashboardWidget w={1} className={styles.dashboardItem} render={() => <DimensionManageContributorsWorkflow {...props} />} />
      </DashboardRow>
    </Dashboard>
  );
}

export default withViewerContext(withNavigationContext(injectIntl(ManageContributors)));
