import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";

import {analytics_service} from '../../../../services/graphql'
import {CommitSummaryPanel} from "../../../widgets/activity/ActivitySummary/view";


export const CommitSummaryWidget = (
  {
    dimension,
    instanceKey,
    pollInterval
  }) => (
  <Query
    client={analytics_service}
    query={
      gql`
           query ${dimension}CommitSummary($key: String!) {
            ${dimension}(key: $key ) {
                ... CommitSummary
            }
           }
          ${CommitSummaryPanel.interface}
      `}
    variables={{key: instanceKey}}
    errorPolicy={'all'}
    pollInterval={pollInterval || analytics_service.defaultPollInterval()}
  >
    {
      ({loading, error, data}) => {
        if (loading) return <Loading/>;
        if (error) return null;
        return (
          <CommitSummaryPanel
            commitSummary={data[dimension]}
          />
        );

      }
    }
  </Query>
);



