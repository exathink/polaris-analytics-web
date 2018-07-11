import React from 'react';
import {NavGrid, NavGridItem} from "../../components/navGrid";
import {Contexts} from "../../meta";
import {FormattedMessage} from 'react-intl';

const messages = {
  yourDashboards: <FormattedMessage id='landing.yourDashboards' defaultMessage='Your Dashboards'/>,
  ossDashboards: <FormattedMessage id='landing.ossDashboards' defaultMessage='Open Source Dashboards'/>
};

export const Landing = () => (
  <NavGrid>
    <NavGridItem
        link={'/app/dashboard'}
        icon={`ion ${Contexts.accounts.icon}`}
        title={messages.yourDashboards}
      />
    <NavGridItem
        link={'/app/oss'}
        icon={`ion ${Contexts.oss.icon}`}
        title={messages.ossDashboards}
    />
  </NavGrid>

);