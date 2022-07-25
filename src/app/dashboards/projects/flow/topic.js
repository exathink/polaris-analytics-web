import {Topics} from "../../../meta/topics";
import Summary from "./summary/topic";
import Second from "./second/topic";

const topic = {
  ...Topics.flow,
  routes: [
    {
      match: "first",
      subnav: true,
      topic: Summary,
    },
    {
      match: "second",
      subnav: true,
      topic: Second,
    },
    {
      match: '',
      redirect: 'second'
    }
  ]
};

export default topic;


