import React from 'react';
import {NavGrid, NavGridItem} from "../../components/navGrid";
import {Contexts} from "../../meta";
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';


const messages = {
  yourDashboards: <FormattedMessage id='landing.yourDashboards' defaultMessage='Your Dashboards'/>,
  importRepositories: <FormattedMessage id='landing.importRepositories' defaultMessage='Analyze your code'/>,
  ossDashboards: <FormattedMessage id='landing.ossDashboards' defaultMessage='Browse open source dashboards'/>
};

export const Landing = connect(state => ({
  account: state.user.get('account')
}))(({account}) => (
    <NavGrid>
      {
        account.repo_count > 0?
            <NavGridItem
            link={'/app/dashboard'}
            icon={`ion ${Contexts.accounts.icon}`}
            title={messages.yourDashboards}
            /> :
          <NavGridItem
            link={'/app/setup'}
            icon={`ion ion-ios-download`}
            title={messages.importRepositories}
            />
      }
      <NavGridItem
        link={'/app/oss'}
        icon={`ion ${Contexts.oss.icon}`}
        title={messages.ossDashboards}
      />
    </NavGrid>
  )
);