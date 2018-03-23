import {polarisChartsService} from "../../../viz/api";
import {DataSources} from "../../../viz/dataSources";
import {formatPolarisTimestamp} from "../../../helpers/utility";
import moment from 'moment';




if (process.env.NODE_ENV === 'development') {
  import ('chance');
  let chance = require('chance').Chance();
  polarisChartsService.registerMockDataSource(DataSources.project_summary, {
    fetchData: (dataSource, params) => {
      console.log("fetching stub data..");
      const data = [];
      const items = params.items || 15;

      for (let i = 0; i < items; i++) {
        const earliest_commit = moment(chance.date({year: 2017}));
        const latest_commit = moment(earliest_commit).add(chance.integer({min:1, max:500}), 'days');
        data.push({
          project: chance.animal() + `(${i})`,
          commit_count: chance.integer({min: 20, max:2000}),
          contributor_count: chance.integer({min:1, max: 300}),
          earliest_commit: formatPolarisTimestamp(earliest_commit),
          latest_commit: formatPolarisTimestamp(latest_commit)
        })
      }
      return data;
    }
  })
}