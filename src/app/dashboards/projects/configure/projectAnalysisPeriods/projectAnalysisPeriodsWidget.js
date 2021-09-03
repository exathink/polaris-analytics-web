import React from "react";
import {ProjectAnalysisPeriodsView} from "./projectAnalysisPeriodsView";

export const ProjectAnalysisPeriodsWidget = ({
  dimension,
  instanceKey,
  wipAnalysisPeriod,
  flowAnalysisPeriod,
  trendsAnalysisPeriod,
}) => {
  return (
    <ProjectAnalysisPeriodsView
      dimension={dimension}
      instanceKey={instanceKey}
      wipAnalysisPeriod={wipAnalysisPeriod}
      flowAnalysisPeriod={flowAnalysisPeriod}
      trendsAnalysisPeriod={trendsAnalysisPeriod}
    />
  );
};
