import App from './app/reducer';
import containerReducers from '../app/containers/redux/reducers';

export default {
    App,
  ...containerReducers
};
