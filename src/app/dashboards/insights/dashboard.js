import React from "react";
import {withDetailRoutes} from "../../framework/viz/dashboard/withDetailRoutes";
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";


export function InsightsDashboard({dashboardUrl, itemSelected, navigate, context, fullScreen}) {

  return (
    <div className="">
      Insights Module
    </div>
  );
}

export default withNavigationContext(withDetailRoutes(InsightsDashboard));
