import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';

import {Loading} from "../../../../components/graphql/loading";
import {Contexts} from "../../../../meta";
import {analytics_service} from '../../../../services/graphql/index'
import {ActivityLevelDetailModel} from "../../views/activityProfile/index";
import {ActivityLevelSummaryView} from "../../views/activityProfile/activityLevelSummaryView";
import {ActivityLevelDetailView} from "../../views/activityProfile/activityLevelDetailView";


export const AccountContributorActivityProfileWidget = (
  {
    dimension,
    instanceKey,
    childDimension,
    view,
    pollInterval,
    ...rest
  }) => (
  <Query
    client={analytics_service}
    query={
      gql`
       query accountContributorsActivitySummaries($key: String!, $cursor: String){
          account(key: $key){
              id
              contributors(interfaces: [CommitSummary, RepositoryCount], first: 5, after: $cursor) @connection(key: "contributors") {
                count

                edges{
                    cursor
                    node {

                      ... on NamedNode{
                        name
                        key
                      }
                      ... on CommitSummary{
                          earliestCommit
                          latestCommit
                          commitCount
                      }
                      ... on RepositoryCount {
                        repositoryCount
                      }
                    }
                }
                pageInfo {
                    hasNextPage
                    startCursor
                    endCursor
                }
              }
          }
       }
    `}
    variables={{
      key: instanceKey,
      cursor: null
    }}
    //pollInterval={pollInterval || analytics_service.defaultPollInterval()}
  >
    {
      ({loading, error, data, fetchMore}) => {
        if (loading) return <Loading/>;
        if (error) return null;
        const model = ActivityLevelDetailModel.initModelFromCommitSummaries(
          data[dimension][childDimension].edges.map(edge => edge.node),
          data[dimension][childDimension].count,
          'repositoryCount',
          Contexts.repositories,
          rest
        );
        const onLoadMore = () => console.log('reload') || data.account.contributors.pageInfo.hasNextPage ? fetchMore({
          variables: {
            cursor: data.account.contributors.pageInfo.endCursor
          },
          updateQuery: (previousResult, {fetchMoreResult}) => {
            const newEdges = fetchMoreResult.account.contributors.edges;
            const pageInfo = fetchMoreResult.account.contributors.pageInfo;
            return newEdges.length
              ? {
                  account: {
                    __typename: previousResult.account.__typename,
                    id: previousResult.account.id,
                    contributors: {
                      __typename: previousResult.account.__typename,
                      count: previousResult.account.contributors.count,
                      edges: [...previousResult.account.contributors.edges, ...newEdges],
                      pageInfo
                    }
                  }
                }
              : previousResult;
          }
        }) : null;
        return (
          view && view === 'detail' ?
            <ActivityLevelDetailView
              model={model}
              onLoadMore={onLoadMore}
              {...rest}
            /> :
            <ActivityLevelSummaryView
              model={model}
              {...rest}
            />
        )
      }
    }
  </Query>
);