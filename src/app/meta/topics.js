import React from 'react';
import {FormattedMessage} from 'react-intl';

export const Topics = {
  activity: {
    name: 'activity',
    displays: {
      default: () => (<FormattedMessage id='topics.activity' defaultMessage="Activity"/>)
    }
  },
  contributors: {
    name: 'contributors',
    displays: {
      default: () => (<FormattedMessage id='topics.contributors' defaultMessage="Contributors"/>)
    }
  }

};