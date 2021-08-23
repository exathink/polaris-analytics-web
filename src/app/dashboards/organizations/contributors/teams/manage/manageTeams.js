import React from "react";
import {injectIntl} from "react-intl";
import {Loading} from "../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {withNavigationContext} from "../../../../../framework/navigation/components/withNavigationContext";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {useQueryOrganizationTeams} from "../useQueryOrganizationTeams";
import {ManageTeamsWorkflow} from "./manageTeamsWorkflow";
import styles from "../../../../../framework/viz/dashboard/dashboardItem.module.css";

const dashboard_id = "dashboards.contributors.manage.manage-teams";

function ManageTeams({context, intl}) {
  const organizationKey = context.getInstanceKey("organization");
  const {loading, error, data} = useQueryOrganizationTeams({
    organizationKey,
  });

  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("ManageTeamsWorkflow.useQueryOrganizationTeams", error);
    return null;
  }

  const edges = data?.["organization"]?.["teams"]?.["edges"] ?? [];
  const teamsList = edges.map((edge) => edge.node);

  const props = {organizationKey, teamsList, context, intl};

  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h={"95%"}>
        <DashboardWidget className={styles.dashboardItem} w={1} render={() => <ManageTeamsWorkflow {...props} />} />
      </DashboardRow>
    </Dashboard>
  );
}

export default withNavigationContext(injectIntl(ManageTeams));
