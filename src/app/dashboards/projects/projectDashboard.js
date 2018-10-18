import React from 'react';
import {analytics_service} from "../../services/graphql";
import gql from "graphql-tag";

import {Loading} from "../../components/graphql/loading";
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";
import {Query} from "react-apollo";
import {DashboardLifecycleManager} from "../../framework/viz/dashboard";


class WithProject extends React.Component {

  onDashboardMounted(project) {

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
            query with_project_instance($key: String!) {
                project(key: $key, interfaces:[CommitSummary]){
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
          key: context.getInstanceKey('project')
        }}
        pollInterval={pollInterval}
      >
        {
          ({loading, error, data}) => {
            if (loading) return <Loading/>;
            if (error) return null;
            const project = data.project;

            return (
              <DashboardLifecycleManager
                render={render}
                context={context}
                project={project}
                onMount={
                  () => this.onDashboardMounted(project)
                }
              />
            )
          }
        }
      </Query>
    )
  }
}
export const ProjectDashboard = withNavigationContext(WithProject);


