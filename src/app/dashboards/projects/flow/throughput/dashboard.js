import React from "react";
import {ProjectDashboard} from "../../projectDashboard";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";
import {DimensionThroughputDetailDashboard} from "../../../shared/widgets/work_items/throughput/dimensionThroughputDetailDashboard";

const dashboard = ({viewerContext}) => (
  <ProjectDashboard
    pollInterval={1000 * 60}
    render={({project, ...rest}) => (
      <DimensionThroughputDetailDashboard dimension={"project"} dimensionData={project} {...rest} viewerContext={viewerContext} />
    )}
  />
);

export default withViewerContext(dashboard);
