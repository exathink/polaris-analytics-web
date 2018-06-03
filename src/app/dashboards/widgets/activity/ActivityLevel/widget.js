import React from 'react';
import {DashboardWidget} from "../../../../framework/viz/dashboard";
import {withModel} from "../../../../framework/viz/model/withModel";
import {ActivityLevelDetailModel} from "./model";

import {ActivityLevelDetailView} from "./activityLevelDetailView";
import {ActivityLevelSummaryView} from "./activityLevelSummaryView";

export const ActivityProfile = withModel(ActivityLevelDetailModel)(
  props => (
    <DashboardWidget
          primary={ActivityLevelSummaryView}
          detail={ActivityLevelDetailView}
          {...props}
        />
  )
);
