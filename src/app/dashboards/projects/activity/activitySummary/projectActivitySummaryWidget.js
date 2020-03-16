import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";
import {analytics_service} from "../../../../services/graphql";
import {ActivitySummaryPanel} from "./activitySummaryPanelView";
import {Contexts} from "../../../../meta";


export const ProjectActivitySummaryWidget = (
  {
    instanceKey,
    pollInterval
  }) => (
  <Query
    client={analytics_service}
    query={
      gql`
           query projectActivitySummary($key: String!) {
            project(key: $key, interfaces: [CommitSummary]) {
                id
                ... on CommitSummary {
                    latestCommit
                }
                
            }
           }
      `}
    variables={{key: instanceKey}}
    errorPolicy={'all'}
    pollInterval={pollInterval || analytics_service.defaultPollInterval()}
  >
    {
      ({loading, error, data}) => {
        if (loading) return <Loading/>;
        if (error) return null;
        const {...commitSummary} = data['project'];
            return(
                <ActivitySummaryPanel
                  model={
                    {
                      ...commitSummary,

                    }
                  }
                />
            )

      }
    }
  </Query>
);



