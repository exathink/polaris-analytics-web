import React from "react";
import { ProjectDashboard } from "../../projectDashboard";
import {
  DimensionFlowMixTrendsDetailDashboard
} from "../../../shared/widgets/work_items/trends/flowMix/flowMixTrendsDetailDashboard";
import { withViewerContext } from "../../../../framework/viewer/viewerContext";

export const dashboard = ({viewerContext}) => (
  <ProjectDashboard
    pollInterval={60 * 1000}
    render={({project, context, ...rest}) => {
      const {
        flowAnalysisPeriod,
        includeSubTasksFlowMetrics
      } = project.settingsWithDefaults
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
      )
    }}
  />
);


export default withViewerContext(dashboard);