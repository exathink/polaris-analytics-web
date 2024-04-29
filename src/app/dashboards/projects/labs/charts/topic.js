import React from 'react';
import {Topics} from "../../../../meta/topics";
import {FormattedMessage} from "react-intl.macro";
import {AimOutlined} from "@ant-design/icons";

const ChartsTopic = {
  name: 'charts',
  display: () => (<FormattedMessage id='topics.charts' defaultMessage="Charts"/>),
  Icon: AimOutlined
}

const topic =  {
  ...ChartsTopic,
  routes: [
    {
      match: '',
      component: React.lazy(() => import('./dashboard'))
    }
  ]
};
export default topic;
