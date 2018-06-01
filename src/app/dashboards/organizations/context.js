import React from 'react';
import {FormattedMessage} from 'react-intl';
import Wip from "../../../containers/Page/wip";
import FourZeroFour from "../../../containers/Page/404";
import Projects from "../projects/context";
import Activity from './activity/topic';
import {Contexts} from "../../meta/contexts";
import {Topics} from "../../meta/topics";


const messages = {
  instanceDisplay: (instanceName) => (
    <FormattedMessage
      id="contexts.organizations.instance"
      defaultMessage="Organization: {instance}"
      values={{instance: instanceName}}/>
  )
};

const context = {
  ...Contexts.organizations,
  hidden: true,
  routes: [
    {
      match: ':organization',
      context: {
        ...Contexts.organizations,
        display: match => messages.instanceDisplay(match.params.organization),
        routes: [
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