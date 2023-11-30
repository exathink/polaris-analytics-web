// @flow
import React from "react";
import {FormattedMessage} from "react-intl.macro";

import FourZeroFour from "../../../containers/Page/404";
import type {Context} from "../../framework/navigation/context/context";

import Wip from "./wip/topic";
import Flow from "./flow/topic";
import Repositories from "./repositories/topic";
import PullRequests from "./pull_requests/topic";
import Contributors from "./contributors/topic";
import Trends from "./trends/topic";
import Configure from "./configure/topic";
import Quality from "./quality/topic";
import {Contexts} from "../../meta/contexts";
import {UI_NEW_CARD_DESIGN} from "../../../config/featureFlags";

import {instanceMatchPattern} from "../../framework/navigation/context/helpers";
import {ProjectValueStreamsWidget} from "./shared/components/projectValueStreamUtils";

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
        ContextControl: ProjectValueStreamsWidget,
        routes: [
          {
            group: "Manage",
            divider: true
          },
          {
            match: 'flow',
            topic: Flow
          },
          {
            match: 'quality',
            topic: Quality
          },
          {

            match: '360-view',
            topic: Trends
          },
          {
            match: 'configure',
            topic: Configure
          },
          {
            group: 'Explore',
            divider: true
          },
          {
            match: "repositories",
            topic: Repositories
          },
          {
            match: "contributors",
            topic: Contributors
          },

          {
            submenu: 'Explore',
            routes: [
              {
                match: "repositories",
                topic: Repositories
              },
              {
                match: "contributors",
                topic: Contributors
              }
            ]
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

