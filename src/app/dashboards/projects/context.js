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
import Investments from "./investments/topic";
import Configure from "./configure/topic";
import Quality from "./quality/topic";
import Labs from "./labs/topic";

import {Contexts} from "../../meta/contexts";
import {LABS, UI_NEW_CARD_DESIGN} from "../../../config/featureFlags";

import {instanceMatchPattern} from "../../framework/navigation/context/helpers";
import {ProjectValueStreamsWidget} from "./shared/components/projectValueStreamUtils";

const messages = {
  instanceDisplay: (instanceName) => (
    <FormattedMessage
      id="contexts.projects.instance"
      defaultMessage="Project: {instance}"
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

            match: 'investments',
            topic: Investments
          },
          {
            match: 'quality',
            topic: Quality
          },
          {
            match: 'flow',
            topic: Flow
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
            group: 'Configure',
            divider: true
          },
          {
            match: 'configure',
            topic: Configure
          },
          /**
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
          **/

          {
            requiredFeatures: [LABS],
            match: "labs",
            topic: Labs
          },
          {
            match: '',
            redirect: 'investments'
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

