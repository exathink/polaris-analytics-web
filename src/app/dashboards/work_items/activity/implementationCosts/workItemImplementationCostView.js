import React from 'react';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {Statistic} from "antd";

export const WorkItemImplementationCostView = (
  {
    workItem: {
      implementationCost,
      implementationSpan,
      authorCount
    },
    view
  }
) => (

    <VizRow h={1}>
      <VizItem w={1/3}>
        <Statistic
            title={<span>Cost</span>}
            value={ implementationCost || 'N/A'}
            precision={1}
            valueStyle={{color: '#3f8600'}}
            style={{backgroundColor: '#f2f3f6'}}
            suffix={"Dev Days"}
          />
      </VizItem>
      <VizItem w={1/3}>
        <Statistic
            title={<span>Duration</span>}
            value={ implementationSpan || 'N/A'}
            precision={1}
            valueStyle={{color: '#3f8600'}}
            style={{backgroundColor: '#f2f3f6'}}
            suffix={"Days"}
          />
      </VizItem>
      <VizItem w={1/3}>
        <Statistic
            title={<span>Contributors</span>}
            value={ authorCount || 'N/A'}
            precision={0}
            valueStyle={{color: '#3f8600'}}
            style={{backgroundColor: '#f2f3f6'}}

          />
      </VizItem>
    </VizRow>

)

