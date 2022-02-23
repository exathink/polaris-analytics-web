import React from "react";
import {Loading} from "../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../components/graphql/utils";
import {OrgTeamsTableView} from "./orgTeamsTableView";
import {useQueryOrganizationTeams} from "./useQueryOrganizationTeams";

export function OrgTeamsTableWidget({organizationKey, days, measurementWindow, samplingFrequency, specsOnly, includeSubTasks, latestCommit, latestWorkItemEvent}) {
  const {loading, error, data} = useQueryOrganizationTeams({
    organizationKey,
    days,
    measurementWindow,
    samplingFrequency,
    specsOnly,
    includeSubTasks,
    latestCommit,
    latestWorkItemEvent
  });

  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("OrgTeamsTableWidget.useQueryOrganizationTeams", error);
    return null;
  }

  return <OrgTeamsTableView days={days} measurementWindow={measurementWindow} samplingFrequency={samplingFrequency} data={data} organizationKey={organizationKey} specsOnly={specsOnly}/>;
}
