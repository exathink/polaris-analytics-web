import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";

import {analytics_service} from '../../../../services/graphql'
import {CommitSummaryPanel} from "../../../widgets/activity/ActivitySummary/view";
import {ActivityLevelDetailModel} from "../../../widgets/activity/ActivityLevel";
import {ActivityLevelSummaryView} from "../../../widgets/activity/ActivityLevel/activityLevelSummaryView";
import {ActivityLevelDetailView} from "../../../widgets/activity/ActivityLevel/activityLevelDetailView";


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
              ${childDimension}(interfaces: [CommitSummary, ContributorSummary]) {
                count
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
                      ... on ContributorSummary {
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