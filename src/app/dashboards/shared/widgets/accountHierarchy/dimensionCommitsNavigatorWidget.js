import React from 'react';

import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";

import {analytics_service} from '../../../../services/graphql/index'
import {CommitsTimelineChart, CommitsTimelineTable} from "../../views/commitsTimeline";
import Commits from "../../../commits/context";
import Contributors from "../../../contributors/context";
import Repositories from "../../../repositories/context";
import moment from 'moment';

function onCommitsSelected(context, commits) {
  if(commits.length === 1) {
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
    before,
    view,
    groupBy,
    display,
    onSelectionChange

  }) => (
    <Query
      client={analytics_service}
      query={
        gql`
            query ${dimension}_commits($key: String!, $days: Int, $before: DateTime) {
                ${dimension}(key: $key){
                    id
                    commits(days: $days, before: $before) {
                        edges {
                            node {
                                id
                                name
                                key
                                author
                                authorKey
                                committer
                                commitDate
                                commitMessage
                                branch
                                repository
                                repositoryKey
                                stats {
                                    files
                                    lines
                                    insertions
                                    deletions
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
        days: days || 0,
        before: before != null ? moment(before) : before
      }}
    >
      {
        ({loading, error, data}) => {
          if (loading) return <Loading/>;
          if (error) return null;

          const commits = data[dimension].commits.edges.map(edge => edge.node);
          return (
            display === 'table' ?
                <CommitsTimelineTable commits={commits}/>
                :
                <CommitsTimelineChart
                  commits={commits}
                  context={context}
                  instanceKey={instanceKey}
                  view={view}
                  groupBy={groupBy}
                  days={days}
                  before={before}
                  onSelectionChange={
                    onSelectionChange || (commits => onCommitsSelected(context, commits))
                  }
                  onAuthorSelected={
                    (authorName, authorKey) => context.navigate(Contributors, authorName, authorKey)
                  }
                  onRepositorySelected={
                    (repositoryName, repositoryKey) => context.navigate(Repositories, repositoryName, repositoryKey)
                  }
                />
          )
        }
      }
    </Query>
);


