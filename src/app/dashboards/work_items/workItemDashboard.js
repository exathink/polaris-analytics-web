import React from 'react';
import {analytics_service} from "../../services/graphql";
import gql from "graphql-tag";

import {Loading} from "../../components/graphql/loading";
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";
import {Query} from "react-apollo";
import {DashboardLifecycleManager} from "../../framework/viz/dashboard";


class WithWorkItem extends React.Component {

  onDashboardMounted(workItem) {

  }

  render() {
    const {
      render,
      pollInterval,
      context,
      polling,
    } = this.props;

    return (
      <Query
        client={analytics_service}
        query={
          gql`
            query with_work_item_instance($key: String!) {
                workItem(key: $key, interfaces:[CommitSummary, WorkItemEventSpan]){
                    id
                    name
                    key
                    displayId
                    workItemType
                    state
                    stateType
                    earliestCommit
                    latestCommit
                    commitCount
                    latestWorkItemEvent
                }
            }
        `
        }
        variables={{
          key: context.getInstanceKey('work_item')
        }}
        pollInterval={polling ? pollInterval : 0}
      >
        {
          ({loading, error, data}) => {
            if (loading) return <Loading/>;
            if (error) return null;
            const workItem = data.workItem;

            return (
              <DashboardLifecycleManager
                render={render}
                context={context}
                workItem={workItem}
                onMount={
                  () => this.onDashboardMounted(workItem)
                }
              />
            )
          }
        }
      </Query>
    )
  }
}
export const WorkItemDashboard = withNavigationContext(WithWorkItem);


