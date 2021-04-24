import React from 'react';
import {CardGrid} from "../../components/cardGrid";
import {NavCard} from "../../components/cards";
import {Contexts} from "../../meta";
import {FormattedMessage} from 'react-intl.macro';
import {isAdmin} from "../../helpers/utility";
import {withViewerContext} from "../../framework/viewer/viewerContext";
import {AccountSetup} from "./accountSetup/accountSetup";


const messages = {
  yourDashboards: <FormattedMessage id='landing.yourDashboards' defaultMessage='Your Dashboards'/>,
  importRepositories: <FormattedMessage id='landing.importRepositories' defaultMessage='Analyze your code'/>,
  ossDashboards: <FormattedMessage id='landing.ossDashboards' defaultMessage='Browse open source dashboards'/>,
  admin: <FormattedMessage id='landing.admin' defaultMessage='Admin'/>
};


export const Landing = withViewerContext(
  ({viewerContext}) => {
    const {viewer} = viewerContext;
    if (viewer.account == null) {
      return <AccountSetup viewerContext={viewerContext}/>
    } else {
      return (
        <CardGrid>
          {
            viewer.account.repositories.count > 0 ?
              <NavCard
                link={'/app/dashboard'}
                icon={`ion ${Contexts.accounts.icon}`}
                title={messages.yourDashboards}
              />
              :
              <NavCard
                link={'/app/setup'}
                icon={`ion ion-ios-download`}
                title={messages.importRepositories}
              />
          }
          < NavCard
          link={'/app/oss'}
          icon={`ion ${Contexts.oss.icon}`}
          title={messages.ossDashboards}
          />
          {
            isAdmin(viewer) ?
              <NavCard
                link={'/app/admin'}
                icon={`ion ${Contexts.admin.icon}`}
                title={messages.admin}
              />
              : null
          }

        </CardGrid>
      )
    }
  }
);