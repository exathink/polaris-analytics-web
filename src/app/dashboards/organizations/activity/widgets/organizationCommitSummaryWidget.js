import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";

import {analytics_service} from '../../../../services/graphql'
import {CommitSummaryPanel} from "../../../widgets/activity/ActivitySummary/view";


export const OrganizationCommitSummaryWidget = ({organizationKey}) => (
  <Query
    client={analytics_service}
    query={
      gql`
           query organizationCommitSummary($organizationKey: String!) {
            organization(organizationKey: $organizationKey ) {
                commitSummary {
                    forOrganization {
                        ... CommitSummary
                    }
                }
            }
           }
          ${CommitSummaryPanel.interface}
      `}
    variables={{organizationKey}}
    errorPolicy={'all'}
  >
    {
      ({loading, error, data}) => {
        if (loading) return <Loading/>;
        if (error) return null;
        return (
          <CommitSummaryPanel
            commitSummary={data.organization.commitSummary.forOrganization}
          />
        );

      }
    }
  </Query>
);



