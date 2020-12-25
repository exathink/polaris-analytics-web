import React from 'react';
import { injectIntl } from 'react-intl';
import {FormattedMessage} from 'react-intl.macro';

const InjectMessage = props => <FormattedMessage {...props} />;
export default injectIntl(InjectMessage, {
  withRef: false
});
