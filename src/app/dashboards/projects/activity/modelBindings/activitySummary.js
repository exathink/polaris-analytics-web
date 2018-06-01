import {DataSources} from "../dataSources";
import {polarisTimestamp} from "../../../../helpers/utility";

import {ActivitySummaryModel} from "../../../../views/activity/ActivitySummary";
import {ModelFactory} from "../../../../viz/modelFactory";

export const modelFactory: ModelFactory = {
  getDataBinding: props => ([
    {
      dataSource: DataSources.project_activity_summary,
      params: {
        project: props.context.getInstanceKey('project'),
        mock: false
      }
    }
  ])
};

export const ActivitySummaryModelBinding = [ActivitySummaryModel, modelFactory];


