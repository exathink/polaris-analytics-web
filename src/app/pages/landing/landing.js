import React from 'react';
import {CardGrid} from "../../components/cardGrid";
import {NavCard} from "../../components/cards";
import {Contexts} from "../../meta";
import {FormattedMessage} from 'react-intl';
import {withViewerContext} from "../../framework/viewer/viewerContext";

const messages = {
  yourDashboards: <FormattedMessage id='landing.yourDashboards' defaultMessage='Your Dashboards'/>,
  importRepositories: <FormattedMessage id='landing.importRepositories' defaultMessage='Analyze your code'/>,
  ossDashboards: <FormattedMessage id='landing.ossDashboards' defaultMessage='Browse open source dashboards'/>
};

export const Landing = withViewerContext(
  ({viewer}) => (
    <CardGrid>
      {
        viewer.account != null?
            <NavCard
            link={'/app/dashboard'}
            icon={`ion ${Contexts.accounts.icon}`}
            title={messages.yourDashboards}
            /> :
          <NavCard
            link={'/app/setup'}
            icon={`ion ion-ios-download`}
            title={messages.importRepositories}
            />
      }
      <NavCard
        link={'/app/oss'}
        icon={`ion ${Contexts.oss.icon}`}
        title={messages.ossDashboards}
      />
    </CardGrid>
  )
);