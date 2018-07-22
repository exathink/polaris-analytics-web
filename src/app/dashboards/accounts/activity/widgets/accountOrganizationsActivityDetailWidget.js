import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import  {Loading} from "../../../../components/graphql/loading";

import {analytics_service} from '../../../../services/graphql'
import {CommitSummaryPanel} from "../../../widgets/activity/ActivitySummary/view";
import {ActivityLevelDetailModel} from "../../../widgets/activity/ActivityLevel";
import {ActivityLevelDetailView} from "../../../widgets/activity/ActivityLevel/activityLevelDetailView";




export const AccountOrganizationsActivityDetailWidget = (props) => (
  <Query
    client={analytics_service}
    query={
      gql`
       {
        account {
            id
            organizations {
                commitSummaries {
                    name
                    key
                    ... CommitSummary
                }

            }
        }
       }
       ${CommitSummaryPanel.interface}
    `}
  >
    {
      ({loading, error, data}) => {
        if (loading) return <Loading/>;
        if (error) return null;
        return (
          <ActivityLevelDetailView model={
            ActivityLevelDetailModel.initModelFromCommitSummaries(
              data.account.organizations.commitSummaries,
              props
            )
          }{...props}
          />
        )
      }
    }
  </Query>
);