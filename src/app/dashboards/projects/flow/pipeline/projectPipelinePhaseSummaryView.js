import React from 'react';
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import {VizItem, VizRow} from "../../../shared/containers/layout";

import {WorkItemStateTypeDisplayName} from "../../../shared/config";
import {Statistic} from "../../../../../app/components/misc/statistic/statistic";

const PipelineSummaryView = (
  {
    model: {
      backlog,
      open,
      wip,
      complete,
      unmapped
    }
  }
) => {

  const numUnMapped = unmapped || 0;


  return (
          <VizRow h={1}>
            <VizItem>
              <Statistic
                title={WorkItemStateTypeDisplayName['backlog']}
                value={backlog || 0}
                precision={0}
                valueStyle={{color: '#3f8600'}}

                suffix={"Work Items"}
              />
            </VizItem>
            <VizItem>
              <Statistic
                title={WorkItemStateTypeDisplayName['open']}
                value={open || 0}
                precision={0}
                valueStyle={{color: '#3f8600'}}

                suffix={"Work Items"}
              />
            </VizItem>
            <VizItem>
              <Statistic
                title={WorkItemStateTypeDisplayName['wip']}
                value={wip || 0}
                precision={0}
                valueStyle={{color: '#3f8600'}}

                suffix={"Work Items"}
              />
            </VizItem>
            <VizItem>
              <Statistic
                title={WorkItemStateTypeDisplayName['complete']}
                value={complete || 0}
                precision={0}
                valueStyle={{color: '#3f8600'}}

                suffix={"Work Items"}
              />
            </VizItem>
            {
              numUnMapped > 0 ?
                <VizItem>
                  <Statistic
                    title="Unmapped"
                    value={unmapped || 0}
                    precision={0}
                    valueStyle={{color: '#3f8600'}}

                    suffix={"Work Items"}
                  />
                </VizItem>
              : null
            }
          </VizRow>

  )
};

export const ProjectPipelinePhaseSummaryView = withNavigationContext(PipelineSummaryView);





