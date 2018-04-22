import App from './app/reducer';
import auth from './auth/reducer';
import user from './user/reducer';
import appReducers from '../app/redux/reducers'

export default {
    auth,
    user,
    App,
  ...appReducers
};
