import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";
import {Contexts} from "../../../../meta";
import {analytics_service} from '../../../../services/graphql/index'
import {ActivityLevelDetailModel, ActivityLevelDetailView, ActivityLevelSummaryView} from "../../views/activityProfile";

export const ChildDimensionActivityProfileWidget = (
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
       query ${dimension}${childDimension}ActivitySummaries($key: String!){
          ${dimension}(key: $key){
              id
              ${childDimension}(first: 50, summaries: [ActivityLevelSummary] interfaces: [CommitSummary, ContributorCount]) {
                count
                activityLevelSummary {
                    activeCount
                    quiescentCount
                    dormantCount
                    inactiveCount
                }
                edges{
                    node {
                      id
                      ... on NamedNode{
                        name
                        key
                      }
                      ... on CommitSummary{
                          earliestCommit
                          latestCommit
                          commitCount
                      }
                      ... on ContributorCount {
                        contributorCount
                      }
                    }
                }
              }
          }
       }
    `}
    variables={{key: instanceKey}}
    //pollInterval={pollInterval || analytics_service.defaultPollInterval()}
  >
    {
      ({loading, error, data}) => {
        if (loading) return <Loading/>;
        if (error) return null;
        const model = ActivityLevelDetailModel.initModelFromCommitSummaries(
          data[dimension][childDimension].edges.map(edge => edge.node),
          data[dimension][childDimension].count,
          data[dimension][childDimension].activityLevelSummary,
          'contributorCount',
          Contexts.contributors,
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