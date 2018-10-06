import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';

import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {WithCommit} from "../withCommit";
import {CommitDetails} from "../views/commitDetails";
import {CommitHeader} from "../views/commitHeader";
import {Flex, Box} from 'reflexbox';
import {CommitFileSummary} from "../views/commitFileSummary";
import {CommitLineSummary} from "../views/commitLineSummary";

const dashboard_id = 'dashboards.commit.commits.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Commit Overview'/>
};


export const dashboard = withNavigationContext(
  ({context}) => (
    <WithCommit
      commitKey={context.getInstanceKey('commit')}
      render={
        ({commit}) => (
          <Dashboard>
            <DashboardRow h={"15%"}>
              <DashboardWidget
                w={"40%"}
                name={'commit-stats'}
                render={
                  ({view}) => (
                    <CommitHeader
                      commit={commit}
                      view={view}
                    />
                  )
                }
              />
              <DashboardWidget
                w={"30%"}
                name={'commit-files'}
                render={
                  ({view}) => (
                    <CommitFileSummary
                      commit={commit}
                      view={view}
                    />
                  )
                }
              />
              <DashboardWidget
                w={"30%"}
                name={'commit-lines'}
                render={
                  ({view}) => (
                    <CommitLineSummary
                      commit={commit}
                      view={view}
                    />
                  )
                }
                showDetail={false}
              />
            </DashboardRow>
            <DashboardRow h={"85%"}>
              <DashboardWidget
                w={1}
                name={'commit-summary'}
                render={
                  ({view}) => (
                    <CommitDetails commit={commit}/>
                  )
                }
              />
            </DashboardRow>
          </Dashboard>
        )
      }
    />
  )
);

export default dashboard;

