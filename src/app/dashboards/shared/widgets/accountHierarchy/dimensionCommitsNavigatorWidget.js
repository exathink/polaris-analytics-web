import React from 'react';

import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";

import {analytics_service} from '../../../../services/graphql/index'
import {CommitsTimelineChart} from "../../views/commitsTimeline";


export const DimensionCommitsNavigatorWidget = (
  {
    dimension,
    instanceKey,
    context,
    view

  }) => (
    <Query
      client={analytics_service}
      query={
        gql`
            query ${dimension}_commits($key: String!) {
                ${dimension}(key: $key){
                    id
                    commits {
                        edges {
                            node {
                                id
                                name
                                key
                                author
                                committer
                                commitDate
                                commitMessage
                            }
                        }
                    }
                }
            }
        `
      }
      variables={{
        key: instanceKey
      }}
    >
      {
        ({loading, error, data}) => {
          if (loading) return <Loading/>;
          if (error) return null;
          const commits = data[dimension].commits.edges.map(edge => edge.node);
          return (
            <CommitsTimelineChart
              commits={commits}
              context={context}
              view={view}
            />
          )
        }
      }
    </Query>
);
