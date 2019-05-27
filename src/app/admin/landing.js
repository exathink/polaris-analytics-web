import React from "react";
import {ContextNavCard} from "../components/cards";
import Accounts from './accounts/context';
import {CardGrid} from "../components/cardGrid";
import {Contexts} from "../meta";
import {withViewerContext} from "../framework/viewer/viewerContext";

export default withViewerContext(() => (
  <CardGrid>
    <ContextNavCard
      context={Accounts}
      title={"All Accounts"}
      allowedRoles={['admin']}
    />

  </CardGrid>
))

