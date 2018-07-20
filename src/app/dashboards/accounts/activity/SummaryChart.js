import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {analytics_service} from '../../../services/graphql'
import {ActivitySummary} from "../../widgets/activity/ActivitySummary/view";

import {Contexts} from "../../../meta";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import moment from 'moment';

import {NavigationContext} from "../../../framework/navigation/context/navigationContext";


class CommitSummaryView extends React.Component {
  static fragment = gql`
      fragment CommitSummaryView on CommitSummary {
          earliestCommit
          latestCommit
          commitCount
          contributorCount
      }
  `

}


export const SummaryChart = props => {
  return (
    <Query
      query={gql`
        {
            account {
                commitSummary {
                    forAccount {
                        ... CommitSummaryView
                    }
                    byOrganization {
                        ... CommitSummaryView
                    }
                }
            }
        }
        ${CommitSummaryView.fragment}
      `}
    >
      {
        ({loading, error, data}) => {
          if (loading) return <p> Loading.. </p>;
          if (error) return <p> Error: </p>;
          return (
            <Dashboard {...props}>
              <DashboardRow>

                <DashboardWidget
                  name={'Summary Chart'}
                  primary={
                    props => {
                      const commitSummary = data.account.commitSummary.forAccount;

                      return (
                        <NavigationContext.Consumer>
                          {
                            navigationContext =>
                              <React.Fragment>
                                <ActivitySummary
                                  data={commitSummary}
                                  context={navigationContext.current}
                                />
                                <h3>Organizations</h3>
                                {
                                  data.account.commitSummary.byOrganization.map(commitSummary => (
                                    <ActivitySummary
                                      data={commitSummary}
                                      context={navigationContext.current}
                                    />
                                  ))
                                }
                              </React.Fragment>
                          }
                        </NavigationContext.Consumer>
                      )
                    }
                  }
                />
              </DashboardRow>
            </Dashboard>
          )
        }
      }
    </Query>
  );
};
