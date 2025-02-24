import {Query} from "@apollo/client/react/components"
import React from 'react';
import {analytics_service} from "../../services/graphql";
import {logGraphQlError} from "../../components/graphql/utils";
import {Loading} from "../../components/graphql/loading";
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";
import {DashboardLifecycleManager} from "../../framework/viz/dashboard";
import {WORK_ITEM_WITH_INSTANCE} from "./activity/hooks/useQueryWorkItemWithInstance";


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
        query={WORK_ITEM_WITH_INSTANCE}
        variables={{
          key: context.getInstanceKey('work_item')
        }}
        pollInterval={polling ? pollInterval : 0}
      >
        {
          ({loading, error, data}) => {
            if (loading) return <Loading/>;
            if (error) {
              logGraphQlError('workItemDashboard', error);
              return null;
            }
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


