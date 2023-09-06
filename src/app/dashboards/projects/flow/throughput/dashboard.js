import React from "react";
import {ProjectDashboard, useProjectContext} from "../../projectDashboard";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";
import {DimensionThroughputDetailDashboard} from "../../../shared/widgets/work_items/throughput/dimensionThroughputDetailDashboard";

const ThroughputDashboard = ({viewerContext}) => {
  const {project, ...rest} = useProjectContext();
  return (
    <DimensionThroughputDetailDashboard
      dimension={"project"}
      dimensionData={project}
      {...rest}
      viewerContext={viewerContext}
    />
  );
};

const dashboard = ({viewerContext}) => (
  <ProjectDashboard pollInterval={1000 * 60}>
    <ThroughputDashboard viewerContext={viewerContext} />
  </ProjectDashboard>
);

export default withViewerContext(dashboard);
