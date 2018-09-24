import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';

import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {WithCommit} from "../withCommit";
import {CommitHeader} from "../views/commitHeader";

import {Flex, Box} from 'reflexbox';

const dashboard_id = 'dashboards.commit.commits.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Commit Overview'/>
};


export const dashboard = withNavigationContext(
  ({context}) => (
    <WithCommit
      context={context}
      render={
        ({commit}) => (
          <Dashboard>
            <DashboardRow align={'flex-start'} h={"30%"}>
              <DashboardWidget
                w={1}
                name={'commit-summary'}
                render={
                  ({view}) => (
                    <CommitHeader commit={commit}/>
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

