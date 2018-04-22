import App from './app/reducer';
import auth from './auth/reducer';
import user from './user/reducer';
import vizData from '../app/redux/viz/reducer';
import context from '../app/redux/context/reducer';

export default {
    auth,
    user,
    vizData,
    context,
    App,
};
