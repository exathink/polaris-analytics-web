import {DataSources} from "../dataSources";
import {polarisTimestamp} from "../../../../helpers/utility";
import {withActivityLevel} from "../../../../views/activity/ActivityLevel/activityLevel";
import moment from "moment/moment";

import {ActivityLevelDetailModel} from "../../../../views/activity/ActivityLevel";
import type {ModelFactory} from "../../../../viz/modelFactory";
import {Contexts} from "../../../../meta/contexts";

import {uuidDecode} from "../../../../helpers/uuid";


export const modelFactory: ModelFactory = {
  getDataBinding: props => ([
    {
      dataSource: DataSources.organization_projects_activity_summary,
      params: {
        organization: props.context.getInstanceKey('organization'),
        mock: false
      }
    }
  ])
};

export const ActivityLevelDetailModelBinding = [ActivityLevelDetailModel, modelFactory];