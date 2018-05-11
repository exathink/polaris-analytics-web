import asyncComponent from "../../../../helpers/AsyncFunc";

const topic = {
  name: 'activity',
  routes: [
    {
      match: '',
      component: asyncComponent(() => import('./dashboard'))
    }
  ]
};

export default topic;


