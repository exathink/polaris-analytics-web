import React from 'react';
import {ActivitySummaryView} from "./view";
import {withModel} from "../../../../framework/viz/model/withModel";
import {ActivitySummaryModel} from "./model";
import {DashboardWidget} from "../../../../framework/viz/dashboard";

const ActivitySummaryViz = withModel(ActivitySummaryModel)(ActivitySummaryView);

export const ActivitySummaryWidget = props => (
  <DashboardWidget
    name="activity-summary"
    primary={ActivitySummaryViz}
    {...props}
  />
);

