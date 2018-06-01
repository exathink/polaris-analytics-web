import {DataSources} from "../dataSources";
import {polarisTimestamp} from "../../../../helpers/utility";

import {ActivitySummaryModel} from "../../../../views/activity/ActivitySummary";
import type {ModelFactory} from "../../../../viz/modelFactory";

const modelFactory : ModelFactory = {
  getDataBinding: () => ([
    {
      dataSource: DataSources.activity_summary_for_account,
      params: {
        mock: false
      }
    }
  ]),

};

export const ActivitySummaryModelBinding = [ActivitySummaryModel, modelFactory];
