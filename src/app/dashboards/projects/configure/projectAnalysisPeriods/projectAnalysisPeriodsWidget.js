import React from "react";
import {ProjectAnalysisPeriodsView} from "./projectAnalysisPeriodsView";

export const ProjectAnalysisPeriodsWidget = ({
  instanceKey,
  wipAnalysisPeriod,
  flowAnalysisPeriod,
  trendsAnalysisPeriod,
  cycleTimeTarget
}) => {
  return (
    <ProjectAnalysisPeriodsView
      instanceKey={instanceKey}
      wipAnalysisPeriod={wipAnalysisPeriod}
      flowAnalysisPeriod={flowAnalysisPeriod}
      trendsAnalysisPeriod={trendsAnalysisPeriod}
      cycleTimeTarget={cycleTimeTarget}
    />
  );
};
