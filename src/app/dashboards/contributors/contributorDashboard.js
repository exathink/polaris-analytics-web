import {gql} from "@apollo/client";
import {Query} from "@apollo/client/react/components"
import React from 'react';
import {analytics_service} from "../../services/graphql";

import {Loading} from "../../components/graphql/loading";
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";
import {DashboardLifecycleManager} from "../../framework/viz/dashboard";


class WithContributor extends React.Component {

  onDashboardMounted(contributor) {

  }

  render() {
    const {
      render,
      pollInterval,
      polling,
      context,
    } = this.props;

    return (
      <Query
        client={analytics_service}
        query={
          gql`
            query with_contributor_instance($key: String!) {
                contributor(key: $key, interfaces:[CommitSummary]){
                    id
                    name
                    key
                    earliestCommit
                    latestCommit
                    commitCount
                }
            }
        `
        }
        variables={{
          key: context.getInstanceKey('contributor')
        }}
        pollInterval={polling ? pollInterval : 0}
      >
        {
          ({loading, error, data}) => {
            if (loading) return <Loading/>;
            if (error) return null;
            const contributor = data.contributor;

            return (
              <DashboardLifecycleManager
                render={render}
                context={context}
                contributor={contributor}
                onMount={
                  () => this.onDashboardMounted(contributor)
                }
              />
            )
          }
        }
      </Query>
    )
  }
}
export const ContributorDashboard = withNavigationContext(WithContributor);


