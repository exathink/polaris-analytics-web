import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

const InjectMassage = props => <FormattedMessage {...props} />;
export const foo = injectIntl(InjectMassage, {
  withRef: false
});

export default props => <FormattedMessage {...props}/>

