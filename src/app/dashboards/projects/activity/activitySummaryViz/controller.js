import {DataSources} from "../dataSources";
import {polarisTimestamp} from "../../../../helpers/utility";

import type {ModelFactory} from "../../../../viz/modelFactory";

export const Controller: ModelFactory = {
  getDataSpec: context => ([
    {
      dataSource: DataSources.project_activity_summary,
      params: {
        organization: context.params().organization,
        project: context.params().project,
        mock: false
      }
    }
  ]),
  initModel: (source_data) => {
    const project_summary = source_data[0].data;

    return {
      data: project_summary.map((org_summary) => ({
        commits: org_summary.commit_count,
        contributors: org_summary.contributor_count,
        earliest_commit: polarisTimestamp(org_summary.earliest_commit),
        latest_commit: polarisTimestamp(org_summary.latest_commit)
      }))[0],
      displayProps: {
        bgColor: '#6f759c'
      }
    }
  }
};


