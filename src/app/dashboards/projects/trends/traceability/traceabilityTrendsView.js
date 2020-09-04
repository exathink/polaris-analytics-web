import React, {useState} from 'react';
import {TraceabilityTrendsChart} from "./traceabilityTrendsChart";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {Checkbox} from "antd";
import {Flex} from "reflexbox";

export const ProjectTraceabilityTrendsView = (
  {
    traceabilityTrends,
    measurementPeriod,
    measurementWindow,
    excludeMerges,
    setExcludeMerges,
    view
  }) => {

  return (
    <VizRow h={"100%"}>
      <VizItem w={1}>
        <div style={{width: "100%", height: "100%"}}>
          {
            view === 'detail' &&
              <Flex w={0.95} justify={'flex-end'}>
                <Checkbox
                  enabled={true}
                  checked={excludeMerges}
                  onChange={e => setExcludeMerges(e.target.checked)}
                >
                  Exclude Merges
                </Checkbox>
              </Flex>
          }
          <TraceabilityTrendsChart
            traceabilityTrends={traceabilityTrends}
            measurementPeriod={measurementPeriod}
            measurementWindow={measurementWindow}
            excludeMerges={excludeMerges}
          />
        </div>
      </VizItem>
    </VizRow>
  )
}

