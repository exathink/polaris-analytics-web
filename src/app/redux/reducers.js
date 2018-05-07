import vizData from './viz/reducer';

import navigationReducers from './navigation/reducers';
import dashboardReducers from '../dashboards/redux/reducers';
import containerReducers from '../containers/redux/reducers';
export default {
  vizData,
  ...navigationReducers,
  ...dashboardReducers,
  ...containerReducers
}