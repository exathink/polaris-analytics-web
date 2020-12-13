import {gql} from "@apollo/client";
import {Query} from "@apollo/client/react/components"
import React from 'react';
import {analytics_service} from "../../services/graphql";

import {Loading} from "../../components/graphql/loading";
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";
import {withViewerContext} from "../../framework/viewer/viewerContext";

import {DashboardLifecycleManager} from "../../framework/viz/dashboard";


class WithAccount extends React.Component {

  onDashboardMounted(account) {

  }

  render() {
    const {
      render,
      pollInterval,
      context,
      viewerContext,
    } = this.props;

    return (
      <Query
        client={analytics_service}
        query={
          gql`
            query with_account_instance($key: String!) {
                account(key: $key, interfaces:[CommitSummary]){
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
        variables={{
          key: viewerContext.accountKey
        }}
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
export const AccountDashboard = withNavigationContext(withViewerContext(WithAccount));


