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
      const now = moment();
      for (let i = 0; i < 0.7*items; i++) {
        const latest_commit = moment(now).subtract(chance.integer({min:0, max:120}), 'days');
        const earliest_commit = moment(latest_commit).subtract(chance.integer({min:1, max:30}), 'days');
        data.push({
          project: chance.animal() + `(${i})`,
          commit_count: chance.integer({min: 2, max:50}),
          contributor_count: chance.integer({min:1, max: 20}),
          earliest_commit: formatPolarisTimestamp(earliest_commit),
          latest_commit: formatPolarisTimestamp(latest_commit)
        })
      }
      for (let i = 0; i < 0.20*items; i++) {
        const latest_commit = moment(now).subtract(chance.integer({min:0, max:120}), 'days');
        const earliest_commit = moment(latest_commit).subtract(chance.integer({min:1, max:120}), 'days');
        data.push({
          project: chance.animal() + `(${i})`,
          commit_count: chance.integer({min: 100, max:2000}),
          contributor_count: chance.integer({min:20, max: 50}),
          earliest_commit: formatPolarisTimestamp(earliest_commit),
          latest_commit: formatPolarisTimestamp(latest_commit)
        })
      }
      for (let i = 0; i < 0.1*items; i++) {
        const latest_commit = moment(now).subtract(chance.integer({min:0, max:120}), 'days');
        const earliest_commit = moment(latest_commit).subtract(chance.integer({min:1, max:120}), 'days');
        data.push({
          project: chance.animal() + `(${i})`,
          commit_count: chance.integer({min: 2000, max:5000}),
          contributor_count: chance.integer({min:50, max: 300}),
          earliest_commit: formatPolarisTimestamp(earliest_commit),
          latest_commit: formatPolarisTimestamp(latest_commit)
        })
      }
      return data;
    }
  })
}