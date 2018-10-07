import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../components/graphql/loading";
import {MostActiveChildrenView} from "../../shared/views/mostActiveChildren";
import {analytics_service} from '../../../services/graphql/index'

export const ContributorMostActiveRepositoriesWidget = (
  {
    dimension,
    childConnection,
    instanceKey,
    context,
    childContext,
    top,
    days,
    view

  }) => (
    <Query
      client={analytics_service}
      query={
        gql`
            query ContributorMostActiveRepositories($key: String!, $top: Int, $days: Int) {
                contributor(key: $key){
                    id
                    recentlyActiveRepositories(top: $top, days: $days){
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
        days: days || 7
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