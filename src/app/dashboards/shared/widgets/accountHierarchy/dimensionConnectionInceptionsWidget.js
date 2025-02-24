import {gql} from "@apollo/client";
import {Query} from "@apollo/client/react/components"
import React from 'react';
import {Loading} from "../../../../components/graphql/loading";
import {InceptionsBarChart} from "../../views/inceptions";
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
            <InceptionsBarChart inceptionsSummary={inceptionsSummary} count={count}/>
          )
        }
      }
    </Query>
);