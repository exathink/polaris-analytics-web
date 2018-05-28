import Wip from "../../../containers/Page/wip";
import FourZeroFour from "../../../containers/Page/404";
import Projects from "../projects/context";
import Activity from './activity/topic';
import {Contexts} from "../../meta/contexts";
import {Topics} from "../../meta/topics";

const context = {
  ...Contexts.organizations,
  hidden: true,
  routes: [
    {
      match: ':organization',
      context: {
        name: 'organization',
        display: match => Contexts.organizations.displays.instance(match.params.organization),
        routes: [
          {
            match: 'projects',
            context: Projects
          },
          {
            match: 'activity',
            topic: Activity
          },
          {

            match: 'contributors',
            topic: {
              ...Topics.contributors,
              routes: [
                {
                  match: '',
                  component: Wip
                }
              ]
            }
          },
          {
            match: '',
            redirect: 'activity'
          }
        ]
      }
    },
    {
      match: '',
      component: FourZeroFour
    }
  ]
};


export default context;