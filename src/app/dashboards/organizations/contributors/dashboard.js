import React from "react";
import { Dashboard, DashboardRow, DashboardWidget } from "../../../framework/viz/dashboard";
import { DimensionContributorActivityProfileWidget } from "../../shared/views/activityProfile";

import { Contexts } from "../../../meta/contexts";
import Contributors from "../../contributors/context";
import { DimensionMostActiveChildrenWidget } from "../../shared/widgets/accountHierarchy";
import { OrganizationDashboard } from "../organizationDashboard";
import { OrgTeamsTableWidget } from "./teams/orgTeamsTableWidget";
import Button from "../../../../components/uielements/button";
import { CreateNewTeamWidget } from "./teams/createNewTeam";
import styles from "./dashboard.module.css";
import { withViewerContext } from "../../../framework/viewer/viewerContext";
import {SYSTEM_TEAMS} from "../../../../config/featureFlags";

const dashboard_id = "dashboards.contributors.organization";

function getDashboardControls(organization, viewerContext, context) {
  const manageAliasesControl = () => (
    <Button type="primary" onClick={() => context.go(".", "manage-contributors")} style={{ marginLeft: "10px" }}>
      Manage Aliases
    </Button>
  );
  const manageTeamsControls = [
    () => <CreateNewTeamWidget organizationKey={organization.key} />,
    () => (
      <Button type="primary" onClick={() => context.go(".", "manage-teams")} style={{ marginLeft: "10px" }}>
        Manage Team Assignments
      </Button>
    )
  ];
  if (viewerContext.isFeatureFlagActive(SYSTEM_TEAMS) && organization.teams.count > 0) {
    return [...manageTeamsControls, manageAliasesControl]
  } else {
    return [manageAliasesControl]
  }


}

const TopDashboard = ({ viewerContext }) => (
  <OrganizationDashboard
    pollInterval={60 * 1000}
    render={({ organization, context }) => {


      return (
        <Dashboard dashboard={`${dashboard_id}`} className={styles.organizationDashboard} gridLayout={true}>
          <DashboardRow
            h="22%"
            title={`Contributors Last 90 Days`}
            className={styles.manageContributorRow}
            controls={getDashboardControls(organization, viewerContext, context)}
          >
            <DashboardWidget
              className={styles.activityProfile}
              name="contributors-activity-profile"
              render={({ view }) => (
                <DimensionContributorActivityProfileWidget
                  dimension={"organization"}
                  childDimension={"contributors"}
                  instanceKey={organization.key}
                  context={context}
                  childContext={Contributors}
                  enableDrillDown={true}
                  suppressDataLabelsAt={500}
                  view={view}
                  pageSize={50}
                  referenceDate={organization.latestCommit}
                />
              )}
              showDetail={true}
            />

          </DashboardRow>
          <DashboardRow h={"68%"} title={"Teams"}  className={styles.teamsRow}>
            <DashboardWidget
              w={1}
              name={`Teams`}

              className={styles.orgTeamsTable}
              render={({ view }) =>
                <OrgTeamsTableWidget
                  organizationKey={organization.key}
                  days={30}
                  measurementWindow={30}
                  samplingFrequency={30}
                  specsOnly={true}
                  includeSubTasks={false}
                />}
              showDetail={true}
            />
          </DashboardRow>
        </Dashboard>
      );
    }}
  />
);

export default withViewerContext(TopDashboard);
