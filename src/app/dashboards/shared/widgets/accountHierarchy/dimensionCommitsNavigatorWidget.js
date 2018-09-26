import React from 'react';

import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";

import {analytics_service} from '../../../../services/graphql/index'
import {CommitsTimelineChart} from "../../views/commitsTimeline";
import Commits from "../../../commits/context";

function onCommitsSelected(context, commits) {
  if(commits.length == 1) {
    const commit = commits[0];
    context.navigate(Commits, commit.name, commit.key)
  }
}

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
                                branch
                                repository
                                repositoryKey
                                stats {
                                    files
                                    lines
                                }

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
              onSelectionChange={
                (commits) => onCommitsSelected(context, commits)
              }
            />
          )
        }
      }
    </Query>
);


