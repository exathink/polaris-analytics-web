import vizData from './viz/reducer';
import routes from './navigation/reducer';

import dashboardReducers from '../dashboards/redux/reducers';
import containerReducers from '../containers/redux/reducers';
export default {
  vizData,
  routes,
  ...dashboardReducers,
  ...containerReducers
}