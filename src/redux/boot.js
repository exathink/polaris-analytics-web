import { store } from './store';


export default () =>
  new Promise(() => {
    store.dispatch(authActions.checkAuthorization());
  });
