import React from 'react';
import {analytics_service} from "../../services/graphql";
import gql from "graphql-tag";

import {Loading} from "../../components/graphql/loading";
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";
import {Query} from "react-apollo";
import {DashboardLifecycleManager} from "../../framework/viz/dashboard";


class WithRepository extends React.Component {

  onDashboardMounted(repository) {

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
            query with_repository_instance($key: String!) {
                repository(key: $key, interfaces:[CommitSummary]){
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
          key: context.getInstanceKey('repository')
        }}
        pollInterval={polling ? pollInterval : 0}
      >
        {
          ({loading, error, data}) => {
            if (loading) return <Loading/>;
            if (error) return null;
            const repository = data.repository;

            return (
              <DashboardLifecycleManager
                render={render}
                context={context}
                repository={repository}
                onMount={
                  () => this.onDashboardMounted(repository)
                }
              />
            )
          }
        }
      </Query>
    )
  }
}
export const RepositoryDashboard = withNavigationContext(WithRepository);


