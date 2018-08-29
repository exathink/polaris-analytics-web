import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";
import {Contexts} from "../../../../meta";
import {analytics_service} from '../../../../services/graphql/index'
import {ActivityLevelDetailModel} from "../../views/activityProfile/index";
import {ActivityLevelSummaryView} from "../../views/activityProfile/activityLevelSummaryView";
import {ActivityLevelDetailView} from "../../views/activityProfile/activityLevelDetailView";


export const DimensionContributorActivityProfileWidget = (
  {
    dimension,
    instanceKey,
    childDimension,
    view,
    pollInterval,
    pageSize,
    ...rest
  }) => (
  <Query
    client={analytics_service}
    query={
      gql`
       query ${dimension}${childDimension}ActivitySummaries($key: String!, $pageSize: Int){
          ${dimension}(key: $key){
              id
              contributors(first:$pageSize, summaries:[ActivityLevelSummary], interfaces: [CommitSummary, RepositoryCount]) {
                count
                activityLevelSummary {
                    activeCount
                    quiescentCount
                    dormantCount
                    inactiveCount
                }
                edges{
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
              }
          }
       }
    `}
    variables={{key: instanceKey, ...{pageSize}}}
    //pollInterval={pollInterval || analytics_service.defaultPollInterval()}
  >
    {
      ({loading, error, data}) => {
        if (loading) return <Loading/>;
        if (error) return null;
        const model = ActivityLevelDetailModel.initModelFromCommitSummaries(
          instanceKey,
          data[dimension].contributors.edges.map(edge => edge.node),
          data[dimension].contributors.count,
          data[dimension].contributors.activityLevelSummary,
          'repositoryCount',
          Contexts.repositories,
          dimension,
          'contributors',
          rest
        );
        return (
          view && view === 'detail' ?
            <ActivityLevelDetailView
              model={model}
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