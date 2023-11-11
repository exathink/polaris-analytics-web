import React from "react";
import { FormattedMessage } from "react-intl.macro";
import FourZeroFour from "../../../containers/Page/404";
import Activity from "./activity/topic";
import Contributors from "./contributors/topic";
import Project from "./projects/topic";
import Repositories from "./repositories/topic";

import { Contexts } from "../../meta/contexts";
import { instanceMatchPattern } from "../../framework/navigation/context/helpers";
import { SYSTEM_TEAMS } from "../../../config/featureFlags";

const messages = {
  instanceDisplay: (instanceName) => (
    <FormattedMessage
      id="contexts.organizations.instance"
      defaultMessage="Organization: {instance}"
      values={{ instance: instanceName }}
    />
  )
};

const context = {
  ...Contexts.organizations,
  hidden: true,
  routes: [
    {
      match: `${instanceMatchPattern("organization")}`,
      context: {
        ...Contexts.organizations,
        display: match => messages.instanceDisplay(match.params.organization),
        routes: [
          {
            group: "Explore",
          },
          {
            match: "value-streams",
            topic: Project
          },
          {

            match: "contributors",
            requiredFeatures: [SYSTEM_TEAMS],
            topic: Contributors

          },
          {
            match: "repositories",
            topic: Repositories
          },
          {
            match: "",
            redirect: "value-streams"
          }
        ]
      }
    },
    {
      match: "",
      component: FourZeroFour
    }
  ]
};


export default context;