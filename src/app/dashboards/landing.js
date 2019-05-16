import React from "react";
import {NavCard} from "../components/cards";
import Dashboard from './context';
import {CardGrid} from "../components/cardGrid";
import {Contexts} from "../meta";

export default () => (
  <CardGrid>
    <NavCard
      link={`${Dashboard.url_for}/accounts`}
      icon={Contexts.accounts.icon}
      title={"Account Dashboard"}
    />
  </CardGrid>
)