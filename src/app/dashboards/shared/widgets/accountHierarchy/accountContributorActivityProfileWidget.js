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
    ...rest
  }) => (
  <Query
    client={analytics_service}
    query={
      gql`
       query ${dimension}${childDimension}ActivitySummaries($key: String!){
          ${dimension}(key: $key){
              id
              contributors(interfaces: [CommitSummary, RepositoryCount]) {
                count
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
          'repositoryCount',
          Contexts.repositories,
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