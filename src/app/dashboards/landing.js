import React from "react";
import {NavCard} from "../components/cards";
import Dashboard from './context';
import {CardGrid} from "../components/cardGrid";
import {Contexts} from "../meta";

import Accounts from "./accounts/context";
import OpenSource from "./oss/context";

export default () => (
  <CardGrid>
    <NavCard
      link={`${Accounts.url_for}`}
      icon={Accounts.icon}
      title={"My Account"}
    />
    <NavCard
      link={`${OpenSource.url_for}`}
      icon={OpenSource.icon}
      title={"Open Source"}
    />
  </CardGrid>
)