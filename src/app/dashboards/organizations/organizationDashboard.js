import React from 'react';
import {analytics_service} from "../../services/graphql";
import gql from "graphql-tag";

import {Loading} from "../../components/graphql/loading";
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";
import {Query} from "react-apollo";
import ProjectsTopic from "./projects/topic";


class WithOrganization extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}

  }




  shouldComponentUpdate(nextProps) {
    // We need this because the render prop will be different every time the component updates
    // and we dont want to get into an infinite loop when we fire off the filterTopics event.
    // This terminates the event cycle.
    return this.props.organizationKey !== nextProps.organizationKey || !this.state.organization;
  }

  componentDidUpdate() {
    const {
      showOptionalTopics
    } = this.props;

    // We dont show projects navigation for orgs where no projects have been set up.

    if(this.state.organization && this.state.organization.projects.count > 0) {
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
            this.setState({organization});
            return React.createElement(
              render,
              {
                context,
                organization,
              }
            )
          }
        }
      </Query>
    )
  }
}
export const OrganizationDashboard = withNavigationContext(WithOrganization);


