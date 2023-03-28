import React from "react";
import {ProjectAnalysisPeriodsView} from "./projectAnalysisPeriodsView";

export const ProjectAnalysisPeriodsWidget = ({
  dimension,
  instanceKey,
  name,
  wipAnalysisPeriod,
  flowAnalysisPeriod,
  trendsAnalysisPeriod,
}) => {
  return (
    <ProjectAnalysisPeriodsView
      dimension={dimension}
      instanceKey={instanceKey}
      name={name}
      wipAnalysisPeriod={wipAnalysisPeriod}
      flowAnalysisPeriod={flowAnalysisPeriod}
      trendsAnalysisPeriod={trendsAnalysisPeriod}
    />
  );
};
