// @flow
import React from "react";
import {FormattedMessage} from "react-intl.macro";

import FourZeroFour from "../../../containers/Page/404";
import type {Context} from "../../framework/navigation/context/context";

import Wip from "./wip/topic";
import Flow from "./flow/topic";
import Repositories from "./repositories/topic";
import Contributors from "./contributors/topic";
import Trends from "./trends/topic";
import Alignment from "./alignment/topic";
import Configure from "./configure/topic";
import Quality from "./quality/topic";
import {Contexts} from "../../meta/contexts";


import {instanceMatchPattern} from "../../framework/navigation/context/helpers";

const messages = {
  instanceDisplay: (instanceName) => (
    <FormattedMessage
      id="contexts.projects.instance"
      defaultMessage="Value Stream: {instance}"
      values={{instance: instanceName}}
    />
  ),
};

const context : Context = {
  ...Contexts.projects,
  hidden: true,
  routes: [
    {
      match: `${instanceMatchPattern('project')}`,
      context: {
        ...Contexts.projects,
        display: match => messages.instanceDisplay(match.params.project),
        routes: [
          {
            match: 'flow',
            topic: Flow
          },
          {
            match: 'wip',
            topic: Wip
          },
          {
            match: 'alignment',
            topic: Alignment
          },
          {
            match: 'quality',
            topic: Quality
          },
          {

            match: 'trends',
            topic: Trends
          },
          {
            match: 'contributors',
            topic: Contributors
          },
          {
            match: 'repositories',
            topic: Repositories
          },
          {
            match: 'configure',
            topic: Configure
          },
          {
            match: '',
            redirect: 'flow'
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

