import {Map} from 'immutable';
import {DataSources} from "../dataSources";
import moment from "moment/moment";
import {polarisTimestamp} from "../../../../helpers/utility";
import {withActivityLevel} from "../../../../views/activity/ActivityLevel/activityLevel";
import {Contexts} from "../../../../meta/contexts";
import {ActivityLevelDetailModel} from '../../../../views/activity/ActivityLevel';

import type {ModelFactory} from "../../../../viz/modelFactory";

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
  ]),
  initModel: (source_data, props) => {
    const organization_summaries = source_data[0].data;
    return {
      data: organization_summaries.map((organization_summary) => {
        const earliest_commit = polarisTimestamp(organization_summary.earliest_commit);
        const latest_commit = polarisTimestamp(organization_summary.latest_commit);

        return withActivityLevel({
          id: organization_summary.detail_instance_id,
          entity_name: organization_summary.detail_instance_name,
          commit_count: organization_summary.commit_count,
          contributor_count: organization_summary.contributor_count,
          earliest_commit: earliest_commit,
          latest_commit: latest_commit,
          span: moment.duration(latest_commit.diff(earliest_commit)).asYears(),
          days_since_latest_commit: moment().diff(latest_commit, 'days'),
        })
      }),
      context: props.context,
      childContext: props.childContext,
      span_uom: 'Years',
      onDrillDown: (event) => {
        console.log(`Drill down to ${event.subject_label} ${event.entity_name} ${event.id}`);
        props.navigate.push(`/app/dashboard/${props.childContext.name}/${event.entity_name}/activity?resource=${event.id}`)
      }
    }
  }
};

export const ActivityLevelDetailModelBinding = [ActivityLevelDetailModel, modelFactory];