import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import  {Loading} from "../../../../components/graphql/loading";

import {analytics_service} from '../../../../services/graphql'
import {CommitSummaryPanel} from "../../../widgets/activity/ActivitySummary/view";
import {ActivityLevelDetailModel} from "../../../widgets/activity/ActivityLevel";
import {ActivityLevelSummaryView} from "../../../widgets/activity/ActivityLevel/activityLevelSummaryView";
import {ActivityLevelDetailView} from "../../../widgets/activity/ActivityLevel/activityLevelDetailView";


export const OrganizationRepositoriesActivityWidget = ({organizationKey, view, ...rest}) => (
  <Query
    client={analytics_service}
    query={
      gql`
         query organizationRepositoriesCommitSummaries($organizationKey: String!) {
          organization(organizationKey: $organizationKey) {
              id
              repositories {
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
    variables = {{
      organizationKey
    }}
  >
    {
      ({loading, error, data}) => {
        if (loading) return <Loading/>;
        if (error) return null;
        const model = ActivityLevelDetailModel.initModelFromCommitSummaries(
                  data.organization.repositories.commitSummaries,
                  rest
                );
        return (
          view && view === 'detail'?
            <ActivityLevelDetailView
              model={model}
              {...rest}
            /> :
            <ActivityLevelSummaryView
              model={model}
              {...rest}
            />
        )
      }
    }
  </Query>
);