import vizData from './viz/reducer';
import context from './context/reducer';
import dashboardReducers from '../dashboards/redux/reducers';

export default {
  vizData,
  context,
  ...dashboardReducers
}