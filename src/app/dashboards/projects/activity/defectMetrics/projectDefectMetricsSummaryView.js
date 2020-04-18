import React from 'react';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {Statistic} from "../../../../../app/components/misc/statistic/statistic";
import {percentileToText} from "../../../../helpers/utility";

export const ProjectDefectMetricsSummaryView = (
  {
    showAll,
    percentileLeadTime,
    avgLeadTime,
    maxLeadTime,
    avgCycleTime,
    percentileCycleTime,
    maxCycleTime,

    workItemsInScope,
    targetPercentile,
    workItemStateTypeCounts: {
      backlog: openDefects
    },
    stateMappingIndex,
  }
) => (
  stateMappingIndex.isValid() ?
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={0.25}>
          <Statistic
            title="Backlog"
            value={openDefects || 0}
            precision={0}
            valueStyle={{color: '#3f8600'}}
            style={{backgroundColor: '#f2f3f6'}}
            suffix={"Defects"}
          />
        </VizItem>
        <VizItem w={0.25}>
          <Statistic
            title="Throughput"
            value={workItemsInScope || 0}
            precision={0}
            valueStyle={{color: '#3f8600'}}
            style={{backgroundColor: '#f2f3f6'}}
            suffix={"Defects"}
          />
        </VizItem>
      </VizRow>
    </React.Fragment>
    :
    null
);