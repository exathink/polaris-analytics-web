import React from "react";
import {ProjectDashboard, useProjectContext} from "../../projectDashboard";
import {DimensionFlowMixTrendsDetailDashboard} from "../../../shared/widgets/work_items/trends/flowMix/flowMixTrendsDetailDashboard";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";

export const ValueMixDashboard = ({viewerContext}) => {
  const {project} = useProjectContext();
  const {flowAnalysisPeriod, includeSubTasksFlowMetrics} = project.settingsWithDefaults;

  return (
    <DimensionFlowMixTrendsDetailDashboard
      dimension={"project"}
      instanceKey={project.key}
      days={flowAnalysisPeriod}
      measurementWindow={1}
      samplingFrequency={1}
      includeSubTasks={includeSubTasksFlowMetrics}
      viewerContext={viewerContext}
    />
  );
};

const dashboard = ({viewerContext}) => (
  <ProjectDashboard pollInterval={1000 * 60}>
    <ValueMixDashboard viewerContext={viewerContext} />
  </ProjectDashboard>
);

export default withViewerContext(dashboard);
