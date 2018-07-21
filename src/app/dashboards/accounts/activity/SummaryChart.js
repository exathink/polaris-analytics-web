import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {analytics_service} from '../../../services/graphql'
import {CommitSummaryPanel} from "../../widgets/activity/ActivitySummary/view";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {NavigationContext} from "../../../framework/navigation/context/navigationContext";





export const SummaryChart = props => {
  return (
    <Query
      client={analytics_service}
      query={gql`
        {
            account {
                commitSummary {
                    forAccount {
                        ... CommitSummary
                    }
                    byOrganization {
                        ... CommitSummary
                    }
                }
            }
        }
        ${CommitSummaryPanel.interface}
      `}
    >
      {
        result => <Body {...result}/>
      }
    </Query>
  );
};

const Body = ({loading, error, data}) => {
  if (loading) return <p> Loading.. </p>;
  if (error) return <p> Error: </p>;
  return (
    <React.Fragment>
      <CommitSummaryPanel
        commitSummary={data.account.commitSummary.forAccount}
      />
      <h3>Organizations</h3>
      {
        data.account.commitSummary.byOrganization.map(commitSummary => (
          <CommitSummaryPanel
            commitSummary={commitSummary}
          />
        ))
      }
    </React.Fragment>
  )
};