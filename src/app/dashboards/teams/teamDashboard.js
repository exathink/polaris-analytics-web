import {gql} from "@apollo/client";
import {Query} from "@apollo/client/react/components";
import React from "react";
import {analytics_service} from "../../services/graphql";

import {Loading} from "../../components/graphql/loading";
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";
import {DashboardLifecycleManager} from "../../framework/viz/dashboard";

class WithTeam extends React.Component {
  onDashboardMounted(team) {}

  render() {
    const {render, pollInterval, polling, context} = this.props;

    return (
      <Query
        client={analytics_service}
        query={gql`
          query with_team_instance($key: String!) {
            team(key: $key, interfaces: [ContributorCount]) {
              id
              name
              key
              contributorCount
            }
          }
        `}
        variables={{
          key: context.getInstanceKey("team"),
        }}
        pollInterval={polling ? pollInterval : 0}
      >
        {({loading, error, data}) => {
          if (loading) return <Loading />;
          if (error) return null;
          const team = data.team;

          return (
            <DashboardLifecycleManager
              render={render}
              context={context}
              team={team}
              onMount={() => this.onDashboardMounted(team)}
            />
          );
        }}
      </Query>
    );
  }
}
export const TeamDashboard = withNavigationContext(WithTeam);
