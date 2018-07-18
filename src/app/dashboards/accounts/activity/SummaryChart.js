import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {analytics_service} from '../../../services/graphql'
import {ActivitySummaryView} from "../../widgets/activity/ActivitySummary/view";
import {ActivitySummaryModel} from "../../widgets/activity/ActivitySummary";
import {Contexts} from "../../../meta";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import moment from 'moment';

import {NavigationContext} from "../../../framework/navigation/context/navigationContext";


export const SummaryChart = props => {
  return (
    <Query
      client={analytics_service}
      query={gql`
        {
            account {
                commitSummary(groupBy: account) {
                    ... on CommitSummary {
                        earliestCommit
                        latestCommit
                        commitCount
                        contributorCount
                    }
                }
            }
        }
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
                  primary ={
                    props => {
                      let source = data.account.commitSummary[0];

                      return (
                        <NavigationContext.Consumer>
                          {
                          navigationContext => (
                            <ActivitySummaryView model={new ActivitySummaryModel(
                            {
                              commits: source.commitCount,
                              contributors: source.contributorCount,
                              earliest_commit: moment(source.earliestCommit),
                              latest_commit: moment(source.latestCommit),
                            },
                            1,
                            navigationContext.current)
                          }/>
                          )
                          }
                        </NavigationContext.Consumer>)
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
