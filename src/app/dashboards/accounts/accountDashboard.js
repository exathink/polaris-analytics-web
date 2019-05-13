import React from 'react';
import {analytics_service} from "../../services/graphql";
import gql from "graphql-tag";

import {Loading} from "../../components/graphql/loading";
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";
import {withViewerContext} from "../../framework/viewer/viewerContext";
import {Query} from "react-apollo";

import {DashboardLifecycleManager} from "../../framework/viz/dashboard";


class WithAccount extends React.Component {

  onDashboardMounted(account) {

  }

  render() {
    const {
      render,
      pollInterval,
      context,
    } = this.props;

    return (
      <Query
        client={analytics_service}
        query={
          gql`
            query with_account_instance {
                account(interfaces:[CommitSummary]){
                    id
                    name
                    key
                    earliestCommit
                    latestCommit
                    commitCount
                    organizations(summariesOnly: true) {
                        count
                    }
                    projects(summariesOnly: true){
                        count
                    }
                    repositories(summariesOnly: true){
                        count
                    }
                }
            }
        `
        }
        pollInterval={pollInterval}
      >
        {
          ({loading, error, data}) => {
            if (loading) return <Loading/>;
            if (error) return null;
            const accountInstance = data.account;

            return (
              <DashboardLifecycleManager
                render={render}
                context={context}
                account={accountInstance}
                onMount={
                  () => this.onDashboardMounted(accountInstance)
                }
              />
            )
          }
        }
      </Query>
    )
  }
}
export const AccountDashboard = withNavigationContext(WithAccount);


