import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../components/graphql/loading";
import {MostActiveChildrenView} from "../../shared/views/mostActiveChildren";
import {analytics_service} from '../../../services/graphql/index'
import {toMoment} from "../../../helpers/utility";

export const ContributorMostActiveRepositoriesWidget = (
  {
    dimension,
    childConnection,
    instanceKey,
    context,
    childContext,
    top,
    days,
    latestCommit,
    view,
    referenceDate,

  }) => (
    <Query
      client={analytics_service}
      query={
        gql`
            query ContributorMostActiveRepositories($key: String!, $top: Int, $before: DateTime, $days: Int, $referenceDate: DateTime) {
                contributor(key: $key, referenceDate: $referenceDate){
                    id
                    recentlyActiveRepositories(top: $top, before: $before, days: $days){
                        key
                        name
                        commitCount
                    }
                }
            }
        `
      }
      variables={{
        key: instanceKey,
        top: top || 20,
        days: days || 7,
        before: latestCommit ? toMoment(latestCommit) : null,
        referenceDate: referenceDate
      }}
    >
      {
        ({loading, error, data}) => {
          if (loading) return <Loading/>;
          if (error) return null;
          const activeChildren = data.contributor.recentlyActiveRepositories;
          return (
            <MostActiveChildrenView
              context={context}
              childContext={childContext}
              activeChildren={activeChildren}
              view={view}
              top={top}
              days={days}
              latestCommit={latestCommit}
              onSelectionChange={
                (children) => {
                  onChildrenSelected(context, childContext, children)
                }
              }
            />
          )
        }
      }
    </Query>
);

function onChildrenSelected(context, childContext, children) {
  if(children.length === 1) {
    const child = children[0];
    context.navigate(childContext, child.name, child.key)
  }
}