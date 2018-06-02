import React from 'react';
import {FormattedMessage} from 'react-intl';

import { Dashboard, DashboardRow, DashboardItem} from '../../index';
import {ActivitySummaryViz} from "../../../views/activity/ActivitySummary";
import {ActivityLevelDetailView, ActivityLevelSummaryView} from '../../../views/activity/ActivityLevel';

import ModelBindings from './modelBindings';
import {Contexts} from "../../../meta/contexts";

const dashboard_id = 'dashboards.activity.organization.instance';

const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Organization Overview'/>
};

export const dashboard = ({match, ...rest}) => (
  <Dashboard dashboard={`${dashboard_id}`} modelBindings={ModelBindings} {...rest}>
    <DashboardRow h='15%'>
      <DashboardItem
        w={1}
        name="activity-summary"
        title={messages.topRowTitle}
        primary={ActivitySummaryViz}
      />
    </DashboardRow>
    <DashboardRow h='22%' title={Contexts.projects.display()}>
      <DashboardItem
        w={1/2}
        name="project-activity-levels"
        childContext={Contexts.projects}
        primary={ActivityLevelSummaryView}
        detail={ActivityLevelDetailView}
        enableDrillDown={true}
      />
    </DashboardRow>
    <DashboardRow h='22%' title={Contexts.repositories.display()}>

    </DashboardRow>
    <DashboardRow h='22%' title="Something Else">

    </DashboardRow>
  </Dashboard>

);
export default dashboard;