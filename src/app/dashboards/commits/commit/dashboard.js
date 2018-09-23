import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow} from '../../../framework/viz/dashboard';

import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {WithCommit} from "../withCommit";

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
              <div>Hello {commit.name} from {commit.repositoryUrl}</div>
        )
      }
    />
  )
);

export default dashboard;

