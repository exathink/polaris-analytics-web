import React from "react";
import {ProjectDashboard, useProjectContext} from "../../projectDashboard";
import {DimensionResponseTimeDetailDashboard} from "../../../shared/widgets/work_items/responseTime/dimensionResponseTimeDetailDashboard";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";

export const ResponseTimeDashboard = ({viewerContext}) => {
  const {project, context, ...rest} = useProjectContext();

  return (
    <DimensionResponseTimeDetailDashboard
      dimension={"project"}
      dimensionData={project}
      {...rest}
      viewerContext={viewerContext}
    />
  );
};

const dashboard = () => (
  <ProjectDashboard pollInterval={1000 * 60}>
    <ResponseTimeDashboard />
  </ProjectDashboard>
);

export default withViewerContext(dashboard);
