import vizData from './viz/reducer';
import dashboardReducers from '../dashboards/redux/reducers';

export default {
  vizData,
  ...dashboardReducers
}