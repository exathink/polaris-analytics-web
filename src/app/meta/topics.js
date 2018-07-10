import React from 'react';
import {FormattedMessage} from 'react-intl';

export const Topics = {
  activity: {
    name: 'activity',
    display: () => (<FormattedMessage id='topics.activity' defaultMessage="Activity"/>),
    icon: 'ion-ios-pulse-strong'
  },
  contributors: {
    name: 'contributors',
    display: () => (<FormattedMessage id='topics.contributors' defaultMessage="Contributors"/>),
    icon: 'ion-ios-people'
  },
  publicProjects: {
    name: 'public-projects',
    display: () => (<FormattedMessage id='topics.public-projects' defaultMessage="Public Projects"/>),
    icon: 'ion-folder'
  }

};