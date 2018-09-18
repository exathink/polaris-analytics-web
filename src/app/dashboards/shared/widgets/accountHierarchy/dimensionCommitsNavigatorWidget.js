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
    days,
    view,
    groupBy

  }) => (
    <Query
      client={analytics_service}
      query={
        gql`
            query ${dimension}_commits($key: String!, $days: Int) {
                ${dimension}(key: $key){
                    id
                    commits(days: $days) {
                        edges {
                            node {
                                id
                                name
                                key
                                author
                                committer
                                commitDate
                                commitMessage
                                repository
                                repositoryKey
                            }
                        }
                    }
                }
            }
        `
      }
      variables={{
        key: instanceKey,
        days: days || 0
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
              groupBy={groupBy}
              days={days}
            />
          )
        }
      }
    </Query>
);
