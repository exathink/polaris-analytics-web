import {gql} from "@apollo/client";
import {Query} from "@apollo/client/react/components"
import React from 'react';
import {Loading} from "../../../../components/graphql/loading";
import {analytics_service} from '../../../../services/graphql/index';
import {ActivitySummaryPanel} from "../../views/activitySummary";
import {Contexts} from "../../../../meta/index";
import { getReferenceString } from "../../../../helpers/utility";


export const DimensionActivitySummaryPanelWidget = (
  {
    dimension,
    instanceKey,
    pollInterval,
    latestCommit
  }) => (
  <Query
    client={analytics_service}
    query={
      gql`
           query ${dimension}ActivitySummary($key: String!, $referenceString: String!) {
            ${dimension}(key: $key, interfaces: [CommitSummary, ContributorCount], contributorCountDays: 30, referenceString: $referenceString) {
                id
                ... on CommitSummary {
                    earliestCommit
                    latestCommit
                    commitCount
                }
                ... on ContributorCount {
                    contributorCount
                }
            }
           }
      `}
    variables={{key: instanceKey, referenceString: getReferenceString(latestCommit)}}
    errorPolicy={'all'}
    pollInterval={pollInterval || analytics_service.defaultPollInterval()}
  >
    {
      ({loading, error, data}) => {
        if (loading) return <Loading/>;
        if (error) return null;
        const {contributorCount, ...commitSummary} = data[dimension];
            return(
                <ActivitySummaryPanel
                  model={
                    {
                      ...commitSummary,
                      secondaryMeasure: contributorCount
                    }
                  }
                  secondaryMeasureContext={Contexts.contributors}
                />
            )

      }
    }
  </Query>
);



