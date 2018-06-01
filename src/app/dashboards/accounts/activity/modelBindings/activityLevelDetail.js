import {Map} from 'immutable';
import {DataSources} from "../dataSources";
import moment from "moment/moment";
import {polarisTimestamp} from "../../../../helpers/utility";
import {withActivityLevel} from "../../../../views/activity/ActivityLevel/activityLevel";
import {Contexts} from "../../../../meta/contexts";
import {ActivityLevelDetailModel} from '../../../../views/activity/ActivityLevel';

import type {ModelFactory} from "../../../../viz/modelFactory";

import {encodeInstance} from "../../../../navigation/helpers";

const dataBindings = new Map([
  [Contexts.organizations, DataSources.activity_level_for_account_by_organization],
  [Contexts.projects, DataSources.activity_level_for_account_by_project],
]);


export const modelFactory: ModelFactory =  {

  getDataBinding: (props) => ([
    {
      dataSource: dataBindings.get(props.childContext),
      params: {
        mock: false
      }
    }
  ])
};

export const ActivityLevelDetailModelBinding = [ActivityLevelDetailModel, modelFactory];