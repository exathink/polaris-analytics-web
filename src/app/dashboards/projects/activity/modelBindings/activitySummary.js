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
  ]),
  initModel: (source_data, props) => {
    const project_summary = source_data[0].data;

    return {
      data: project_summary.map((org_summary) => ({
        commits: org_summary.commit_count,
        contributors: org_summary.contributor_count,
        earliest_commit: polarisTimestamp(org_summary.earliest_commit),
        latest_commit: polarisTimestamp(org_summary.latest_commit)
      }))[0],
      context: props.context
    }
  }
};

export const ActivitySummaryModelBinding = [ActivitySummaryModel, modelFactory];


