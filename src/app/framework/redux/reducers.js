import vizData from './vizData/reducer';
import navigation from './navigation/reducer';
import containerReducers from '../../containers/redux/reducers';
export default {
  vizData,
  navigation,
  ...containerReducers
}