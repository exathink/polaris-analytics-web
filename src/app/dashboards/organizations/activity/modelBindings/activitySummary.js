import {DataSources} from "../dataSources";
import {polarisTimestamp} from "../../../../helpers/utility";
import type {ModelFactory} from "../../../../viz/modelFactory";

import {ActivitySummaryModel} from "../../../../views/activity/ActivitySummary";
import {uuidDecode} from "../../../../helpers/uuid";

export const modelFactory : ModelFactory = {
  getDataBinding: props => ([
    {
      dataSource: DataSources.organization_activity_summary,
      params: {
        organization: props.context.getInstanceKey('organization'),
        mock: false
      }
    }
  ])
};

export const ActivitySummaryModelBinding  = [ActivitySummaryModel, modelFactory];

