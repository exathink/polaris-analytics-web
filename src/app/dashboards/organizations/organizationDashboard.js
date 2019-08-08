import React from 'react';
import {analytics_service} from "../../services/graphql";
import gql from "graphql-tag";
import moment from 'moment';

import {Loading} from "../../components/graphql/loading";
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";
import {Query} from "react-apollo";
import WorkTopic from "./work/topic";

import {DashboardLifecycleManager} from "../../framework/viz/dashboard";

class WithOrganization extends React.Component {

  state = {
    lastRefresh: moment()
  }

  onDashboardMounted(organization) {
    const {
      showOptionalTopics
    } = this.props;

    var optionalTopics = [];
    if(organization && organization.workItemsSourceCount > 0) {
      optionalTopics.push(WorkTopic.name)
    }
    if (optionalTopics.length > 0) {
      showOptionalTopics(optionalTopics)
    }
  }

  refresh() {
    this.setState({
      lastRefresh: moment()
    })
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
        query={gql`
            query with_organization_instance($key: String!, $referenceDate: DateTime) {
                organization(key: $key, interfaces:[CommitSummary, ProjectCount, RepositoryCount, WorkItemsSourceCount, WorkItemEventSpan], referenceDate: $referenceDate){
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
        `}
        variables={{
          key: context.getInstanceKey('organization'),
          referenceDate: this.state.lastRefresh
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
                refresh={this.refresh.bind(this)}
                lastRefresh={this.state.lastRefresh}
              />
            )
          }
        }
      </Query>
    )
  }
}
export const OrganizationDashboard = withNavigationContext(WithOrganization);


