import React from 'react';
import {analytics_service} from "../../services/graphql";
import gql from "graphql-tag";

import {Loading} from "../../components/graphql/loading";
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";
import {Query} from "react-apollo";
import ProjectsTopic from "./projects/topic";
import {DashboardLifecycleManager} from "../../framework/viz/dashboard";


class WithOrganization extends React.Component {

  onDashboardMounted(organization) {
    const {
      showOptionalTopics
    } = this.props;

    // We dont show projects navigation for orgs where no projects have been set up.
    if(organization && organization.projects.count > 0) {
      showOptionalTopics([ProjectsTopic.name])
    }
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
            query with_organization_instance($key: String!) {
                organization(key: $key, interfaces:[CommitSummary]){
                    id
                    name
                    key
                    earliestCommit
                    latestCommit
                    commitCount
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
          key: context.getInstanceKey('organization')
        }}
        pollInterval={pollInterval}
      >
        {
          ({loading, error, data}) => {
            if (loading) return <Loading/>;
            if (error) return null;
            const organization = data.organization;

            return (
              <DashboardLifecycleManager
                render={render}
                context={context}
                organization={organization}
                onMount={
                  () => this.onDashboardMounted(organization)
                }
              />
            )
          }
        }
      </Query>
    )
  }
}
export const OrganizationDashboard = withNavigationContext(WithOrganization);


