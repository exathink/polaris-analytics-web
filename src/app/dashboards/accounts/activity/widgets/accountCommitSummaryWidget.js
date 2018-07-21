import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import  {Loading} from "../../../../components/graphql/loading";

import {analytics_service} from '../../../../services/graphql'
import {CommitSummaryPanel} from "../../../widgets/activity/ActivitySummary/view";


export const AccountCommitSummaryWidget = () => (
  <Query
    client={analytics_service}
    query={
      gql`
       {
        account {
            commitSummary {
                forAccount {
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
          <CommitSummaryPanel commitSummary={data.account.commitSummary.forAccount}/>
        )
      }
    }
  </Query>
);