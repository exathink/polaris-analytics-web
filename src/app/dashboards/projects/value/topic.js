import { Topics } from "../../../meta/topics";
import ValueMix from "../flow/valueMix/topic";

const topic = {
  ...Topics.value,
  routes: [
    {
      requiredFeatures: ['ui.new-card-design'],
      match: "valueMix",
      subnav: true,
      topic: ValueMix,
    },

    // This technique works because when the feature flag is present the redirect route to topic overides the route to
    // the main dashboard. Its a bit of a hack, but works for now without having to have a switch in the routes array.
    {
      match: '',
      redirect: 'valueMix'
    }
  ]
};

export default topic;


