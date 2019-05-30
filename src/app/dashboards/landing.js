import React from "react";
import {NavCard} from "../components/cards";
import Dashboard from './context';
import {CardGrid} from "../components/cardGrid";
import {Contexts} from "../meta";

import Accounts from "./accounts/context";
import Organizations from "./organizations/context";

import OpenSource from "./oss/context";
import {withViewerContext} from "../framework/viewer/viewerContext";
import {Redirect} from 'react-router';
import {url_for_instance} from "../framework/navigation/context/helpers";

export default withViewerContext(
  ({viewerContext}) => {
    if (viewerContext.isAdmin()) {
      return (
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
      );
    } else {
      const organizations = viewerContext.getViewerOrganizations();
      return viewerContext.isAccountOwner() || organizations.length > 1 ?
        <Redirect to={`${Accounts.url_for}`}/>
        :
        <Redirect to={`${url_for_instance(Organizations, organizations[0].name, organizations[0].key)}`}/>
    }
  }
)