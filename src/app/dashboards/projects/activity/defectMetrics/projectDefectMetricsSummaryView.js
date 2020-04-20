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
    workItemsInScope: numClosedDefects,
    workItemStateTypeCounts: {
      backlog,
      open,
      wip,
      complete,
    },
    stateMappingIndex,
  }
) => {
  const numOpenDefects = (backlog || 0) + (open || 0) + (wip || 0) + (complete || 0);
  const closeRate = numClosedDefects && numOpenDefects ? (numClosedDefects / (numClosedDefects + numOpenDefects) * 100) : null;

  return (
    stateMappingIndex.isValid() ?
      <React.Fragment>
        {
          !showAll ?
            <VizRow h={"80%"}>
              <VizItem>
                <Statistic
                  title="Unresolved"
                  value={numOpenDefects || 0}
                  precision={0}
                  valueStyle={{color: '#3f8600'}}
                  style={{backgroundColor: '#f2f3f6'}}
                  suffix={"Defects"}
                />
              </VizItem>
              <VizItem>
                <Statistic
                  title="Close Rate"
                  value={closeRate || 'N/A'}
                  precision={2}
                  valueStyle={{color: '#3f8600'}}
                  style={{backgroundColor: '#f2f3f6'}}
                  suffix={closeRate != null ? '%' : ''}
                />
              </VizItem>
              <VizItem>
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
            :
            <VizRow h={"100%"}>
              <VizItem>
                <Statistic
                  title="Unresolved"
                  value={numOpenDefects || 0}
                  precision={0}
                  valueStyle={{color: '#3f8600'}}
                  style={{backgroundColor: '#f2f3f6'}}
                  suffix={"Defects"}
                />
              </VizItem>
              <VizItem>
                <Statistic
                  title="Close Rate"
                  value={closeRate || 'N/A'}
                  precision={2}
                  valueStyle={{color: '#3f8600'}}
                  style={{backgroundColor: '#f2f3f6'}}
                  suffix={closeRate != null ? '%' : ''}
                />
              </VizItem>
              <VizItem>
                <Statistic
                  title={<span>Lead Time <sup>{`Avg`}</sup> </span>}
                  value={avgLeadTime || 0}
                  precision={1}
                  valueStyle={{color: '#3f8600'}}
                  style={{backgroundColor: '#f2f3f6'}}
                  suffix={"Days"}
                />
              </VizItem>
              <VizItem>
                <Statistic
                  title={<span>Lead Time <sup>{`${percentileToText(targetPercentile)}`}</sup> </span>}
                  value={percentileLeadTime || 0}
                  precision={1}
                  valueStyle={{color: '#3f8600'}}
                  style={{backgroundColor: '#f2f3f6'}}
                  suffix={"Days"}
                />
              </VizItem>
              <VizItem>
                <Statistic
                  title={<span>Lead Time <sup>{`Max`}</sup> </span>}
                  value={maxLeadTime || 0}
                  precision={1}
                  valueStyle={{color: '#3f8600'}}
                  style={{backgroundColor: '#f2f3f6'}}
                  suffix={"Days"}
                />
              </VizItem>
              <VizItem>
                <Statistic
                  title={<span>Cycle Time <sup>{`Avg`}</sup> </span>}
                  value={avgLeadTime || 0}
                  precision={1}
                  valueStyle={{color: '#3f8600'}}
                  style={{backgroundColor: '#f2f3f6'}}
                  suffix={"Days"}
                />
              </VizItem>
              <VizItem>
                <Statistic
                  title={<span>Cycle Time <sup>{`${percentileToText(targetPercentile)}`}</sup> </span>}
                  value={percentileCycleTime || 0}
                  precision={1}
                  valueStyle={{color: '#3f8600'}}
                  style={{backgroundColor: '#f2f3f6'}}
                  suffix={"Days"}
                />
              </VizItem>
              <VizItem>
                <Statistic
                  title={<span>Cycle Time <sup>{`Max`}</sup> </span>}
                  value={maxCycleTime || 0}
                  precision={1}
                  valueStyle={{color: '#3f8600'}}
                  style={{backgroundColor: '#f2f3f6'}}
                  suffix={"Days"}
                />
              </VizItem>
            </VizRow>
        }
      </React.Fragment>
      :
      null
  )
};