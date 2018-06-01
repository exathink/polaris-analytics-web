import {DataSources} from "../dataSources";
import {polarisTimestamp} from "../../../../helpers/utility";
import {withActivityLevel} from "../../../../views/activity/ActivityLevel/activityLevel";
import moment from "moment/moment";

import {ActivityLevelDetailModel} from "../../../../views/activity/ActivityLevel";
import {ModelFactory} from "../../../../viz/modelFactory";
import {Contexts} from "../../../../meta/contexts";

export const modelFactory: ModelFactory = {
  getDataBinding: props => ([
    {
      dataSource: DataSources.project_repositories_activity_summary,
      params: {
        project: props.context.getInstanceKey('project'),
        mock: false
      }
    }
  ])
};

export const ActivityLevelDetailModelBinding = [ActivityLevelDetailModel, modelFactory];

