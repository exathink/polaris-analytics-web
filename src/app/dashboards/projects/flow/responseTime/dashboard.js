import React from "react";
import {ProjectDashboard} from "../../projectDashboard";
import {
  DimensionResponseTimeDetailDashboard
} from "../../../shared/widgets/work_items/responseTime/dimensionResponseTimeDetailDashboard";
import { withViewerContext } from "../../../../framework/viewer/viewerContext";

export const dashboard = ({viewerContext}) => (
  <ProjectDashboard
    pollInterval={60 * 1000}
    render={({project, context, ...rest}) => {

      return <DimensionResponseTimeDetailDashboard dimension={"project"} dimensionData={project} {...rest} viewerContext={viewerContext} />
    }}
  />
);


export default withViewerContext(dashboard);