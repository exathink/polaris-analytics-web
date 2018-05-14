import {DataSources} from "../dataSources";
import {polarisTimestamp} from "../../../../helpers/utility";
import type {ControllerDelegate} from "../../../../viz/controllerDelegate";


export const Controller : ControllerDelegate = {
  getDataSpec: context => ([
    {
      dataSource: DataSources.organization_activity_summary,
      params: {
        organization: context.params().organization,
        mock: false
      }
    }
  ]),
  initModel: (source_data) => {
    const org_summary = source_data[0].data;

    return {
      data: org_summary.map((org_summary) => ({
        commits: org_summary.commit_count,
        contributors: org_summary.contributor_count,
        earliest_commit: polarisTimestamp(org_summary.earliest_commit),
        latest_commit: polarisTimestamp(org_summary.latest_commit)
      }))[0],
      displayProps: {
        bgColor: '#356eb2'
      }
    }
  }
};


