import React from 'react';
import {analytics_service} from "../../services/graphql";
import gql from "graphql-tag";
import {Loading} from "../../components/graphql/loading";
import {Query} from "react-apollo";


export class WithOrganization extends React.Component {

  shouldComponentUpdate(nextProps) {
    return this.props.organizationKey !== nextProps.organizationKey
  }

  render() {

    const {organizationKey, render} = this.props;
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
          key: organizationKey,
        }}
        pollInterval={5000}
      >
        {
          ({loading, error, data}) => {
            if (loading) return <Loading/>;
            if (error) return null;
            const organization = data.organization;
            return React.createElement(render, {organization})
          }
        }
      </Query>
    )
  }
}




