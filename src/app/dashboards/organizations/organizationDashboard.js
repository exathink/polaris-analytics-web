import React from 'react';
import {analytics_service} from "../../services/graphql";
import gql from "graphql-tag";

import {Loading} from "../../components/graphql/loading";
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";
import {Query} from "react-apollo";
import ProjectsTopic from "./projects/topic";
import WorkTopic from "./work/topic";

import {DashboardLifecycleManager} from "../../framework/viz/dashboard";


class WithOrganization extends React.Component {

  onDashboardMounted(organization) {
    const {
      showOptionalTopics
    } = this.props;

    var optionalTopics = [];
    // We dont show projects navigation for orgs where no projects have been set up.
    if(organization && organization.projectCount > 0) {
      optionalTopics.push(ProjectsTopic.name)
    }
    if(organization && organization.workItemsSourceCount > 0) {
      optionalTopics.push(WorkTopic.name)
    }
    if (optionalTopics.length > 0) {
      showOptionalTopics(optionalTopics)
    }
  }

  render() {
    const {
      render,
      pollInterval,
      context,
      polling,
    } = this.props;

    return (
      <Query
        client={analytics_service}
        query={
          gql`
            query with_organization_instance($key: String!) {
                organization(key: $key, interfaces:[CommitSummary, ProjectCount, RepositoryCount, WorkItemsSourceCount, WorkItemEventSpan]){
                    id
                    name
                    key
                    earliestCommit
                    latestCommit
                    commitCount
                    projectCount
                    repositoryCount
                    workItemsSourceCount
                    earliestWorkItemEvent
                    latestWorkItemEvent
                }
            }
        `
        }
        variables={{
          key: context.getInstanceKey('organization')
        }}
        pollInterval={polling ? pollInterval : 0}
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


