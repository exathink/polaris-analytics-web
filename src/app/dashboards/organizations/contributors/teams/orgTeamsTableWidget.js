import React from "react";
import {useQueryOrganizationTeamsInfo} from "../../../../admin/account/contributors/useQueryContributorAliasesInfo";
import {Loading} from "../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../components/graphql/utils";
import {OrgTeamsTableView} from "./orgTeamsTableView";

export function OrgTeamsTableWidget({organizationKey}) {
  const {loading, error, data} = useQueryOrganizationTeamsInfo({
    organizationKey,
  });

  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("OrgTeamsTableWidget.useQueryOrganizationTeamsInfo", error);
    return null;
  }

  return <OrgTeamsTableView data={data} />;
}
