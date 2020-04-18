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
    targetPercentile,
    maxCycleTime,
    workItemStateTypeCounts: {
      backlog,
      open,
      wip,
      complete,
      closed
    },
    stateMappingIndex,
  }
) => {
  const numOpenDefects = (backlog || 0)  + (open || 0) + (wip || 0)  + (complete || 0);
  const numClosedDefects = closed;
  const closeRate = numClosedDefects && numOpenDefects ? (numClosedDefects / (numClosedDefects + numOpenDefects) * 100) : null;

  return (
    stateMappingIndex.isValid() ?
      <React.Fragment>
        <VizRow h={"100%"}>
          <VizItem w={0.30}>
            <Statistic
              title="Unresolved"
              value={numOpenDefects || 0}
              precision={0}
              valueStyle={{color: '#3f8600'}}
              style={{backgroundColor: '#f2f3f6'}}
              suffix={"Defects"}
            />
          </VizItem>
          <VizItem w={0.30}>
            <Statistic
              title="Close Rate"
              value={ closeRate || 'N/A'}
              precision={2}
              valueStyle={{color: '#3f8600'}}
              style={{backgroundColor: '#f2f3f6'}}
              suffix={closeRate != null ? '%' : ''}
            />
          </VizItem>
          <VizItem w={0.35}>
            <Statistic
              title={<span>Lead Time <sup>{`${percentileToText(targetPercentile)}`}</sup> </span>}
              value={percentileLeadTime || 0}
              precision={1}
              valueStyle={{color: '#3f8600'}}
              style={{backgroundColor: '#f2f3f6'}}
              suffix={"Days"}
            />
          </VizItem>
        </VizRow>
      </React.Fragment>
      :
      null
  )
};