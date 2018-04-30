import vizData from './viz/reducer';
import navigation from './navigation/reducer';

import dashboardReducers from '../dashboards/redux/reducers';
import containerReducers from '../containers/redux/reducers';
export default {
  vizData,
  navigation,
  ...dashboardReducers,
  ...containerReducers
}