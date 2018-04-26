import vizData from './viz/reducer';
import dashboardReducers from '../dashboards/redux/reducers';
import containerReducers from '../containers/redux/reducers';
export default {
  vizData,
  ...dashboardReducers,
  ...containerReducers
}