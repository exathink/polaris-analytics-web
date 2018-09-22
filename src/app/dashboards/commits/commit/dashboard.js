import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {
  DimensionActivitySummaryPanelWidget, DimensionCommitsNavigatorWidget, DimensionCumulativeCommitCountWidget,
  DimensionMostActiveChildrenWidget
} from "../../shared/widgets/accountHierarchy";
import {Contexts} from "../../../meta/contexts";
import Repositories from "../../repositories/context";

import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {ChildDimensionActivityProfileWidget} from "../../shared/views/activityProfile";
import {analytics_service} from "../../../services/graphql";
import gql from "graphql-tag";
import {Loading} from "../../../components/graphql/loading";
import {CommitsTimelineChart} from "../../shared/views/commitsTimeline";
import {Query} from "react-apollo";

const dashboard_id = 'dashboards.commit.commits.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Commit Overview'/>
};


export const dashboard = withNavigationContext(
  ({context}) => (
    <Query
      client={analytics_service}
      query={
        gql`
            query commit_detail($key: String!) {
                commit(key: $key){
                    id
                    name
                    repository
                    repositoryKey
                    author
                    authorKey
                    committer
                    committerKey
                    commitDate
                    commitMessage
                }
            }
        `
      }
      variables={{
        key: context.getInstanceKey('commit'),
      }}
    >
      {
        ({loading, error, data}) => {
          if (loading) return <Loading/>;
          if (error) return null;
          const commit = data.commit;
          return (
            <Dashboard dashboard={`${dashboard_id}`}>
              <DashboardRow h='15%'>
                <div>Hello {commit.name}</div>
              </DashboardRow>
            </Dashboard>
          );
        }
      }
    </Query>
  )
)


export default dashboard;

