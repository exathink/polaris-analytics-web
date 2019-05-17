import React from "react";
import {ContextNavCard} from "../components/cards";
import Accounts from './accounts/context';
import {CardGrid} from "../components/cardGrid";
import {Contexts} from "../meta";

export default () => (
  <CardGrid>
    <ContextNavCard
      context={Accounts}
    />

  </CardGrid>
)