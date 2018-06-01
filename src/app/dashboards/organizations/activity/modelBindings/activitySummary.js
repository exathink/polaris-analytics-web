import {DataSources} from "../dataSources";
import {polarisTimestamp} from "../../../../helpers/utility";
import type {ModelFactory} from "../../../../viz/modelFactory";

import {ActivitySummaryModel} from "../../../../views/activity/ActivitySummary";

export const modelFactory : ModelFactory = {
  getDataBinding: props => ([
    {
      dataSource: DataSources.organization_activity_summary,
      params: {
        organization: props.context.searchParams().resource,
        mock: false
      }
    }
  ]),
  initModel: (source_data, props) => {
    const org_summary = source_data[0].data;

    return {
      data: org_summary.map((org_summary) => ({
        commits: org_summary.commit_count,
        contributors: org_summary.contributor_count,
        earliest_commit: polarisTimestamp(org_summary.earliest_commit),
        latest_commit: polarisTimestamp(org_summary.latest_commit)
      }))[0],
      context: props.context
    }
  }
};

export const ActivitySummaryModelBinding  = [ActivitySummaryModel, modelFactory];

