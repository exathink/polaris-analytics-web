import React from "react";
import {NavCard} from "../../components/cards";
import CurrentContext from './context';
import {CardGrid} from "../../components/cardGrid";
import {Contexts} from "../../meta";

export default () => (
  <CardGrid>
    <NavCard
      link={`${CurrentContext.url_for}/accounts`}
      icon={Contexts.accounts.icon}
      title={"Blah Blan"}
    />
  </CardGrid>
)