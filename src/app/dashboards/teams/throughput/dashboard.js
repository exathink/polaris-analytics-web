import React from "react";
import {TeamDashboard} from "../teamDashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {DimensionThroughputDetailDashboard} from "../../shared/widgets/work_items/throughput/dimensionThroughputDetailDashboard";

const dashboard = ({viewerContext}) => (
  <TeamDashboard
    pollInterval={1000 * 60}
    render={({team, ...rest}) => (
      <DimensionThroughputDetailDashboard dimension={"team"} dimensionData={team} {...rest} viewerContext={viewerContext} />
    )}
  />
);

export default withViewerContext(dashboard);
