import {Steps} from "antd";
import React from "react";
import styles from "./teams.module.css";
import {UpdateTeamsPage} from "./updateTeamsPage";
import {SelectTeamMembersPage} from "./selectTeamMembersPage";
import {teamsReducer} from "./teamsReducer";
import {ACTIVE_WITHIN_DAYS} from "./selectTeamMembersTable";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {useQueryOrganizationTeams} from "../useQueryOrganizationTeams";
import {Loading} from "../../../../../components/graphql/loading";

const {Step} = Steps;

const initialState = {
  commitWithinDays: ACTIVE_WITHIN_DAYS,
  current: 0,
  selectedRecords: [],
};

export function ManageTeamsWorkflow({organizationKey, context, intl}) {
  const [state, dispatch] = React.useReducer(teamsReducer, initialState);

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

  const pageComponentProps = {
    organizationKey,
    context,
    intl,
    ...state,
    dispatch,
  };

  const steps = [
    {
      title: "Select Team Members",
      content: <SelectTeamMembersPage {...pageComponentProps} />,
    },
    {
      title: "Update Teams",
      content: <UpdateTeamsPage {...pageComponentProps} teamsList={teamsList}/>,
    },
  ];

  const {current} = state;
  return (
    <div className={styles.manageTeamsWrapper}>
      <div className={styles.manageTeamsStepsWrapper}>
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
      </div>
      <div className={styles.manageTeamsStepsContent}>{steps[current].content}</div>
    </div>
  );
}
