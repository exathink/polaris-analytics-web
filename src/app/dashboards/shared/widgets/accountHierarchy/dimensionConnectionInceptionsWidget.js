import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";

import {analytics_service} from '../../../../services/graphql/index'

export const DimensionConnectionInceptionsWidget = (
  {
    dimension,
    instanceKey,
    connection

  }) => (
    <Query
      client={analytics_service}
      query={
        gql`
            query ${dimension}_${connection}_InceptionSummaries($key: String!) {
                ${dimension}(key: $key){
                    id
                    ${connection}(summariesOnly: true, interfaces: [CommitSummary], summaries: [InceptionsSummary]){
                        count
                        inceptionsSummary {
                            year
                            month
                            week
                            inceptions
                        }
                    }
                }
            }
        `
      }
      variables={{key: instanceKey}}
    >
      {
        ({loading, error, data}) => {
          if (loading) return <Loading/>;
          if (error) return null;
          const {inceptionsSummary, count} = data[dimension][connection];
          return (
            <div>
              <span>{count} Inceptions: First One: {inceptionsSummary[0].year}</span>
            </div>
          )
        }
      }
    </Query>
);