import React from 'react';
import {Spin} from 'antd';

export const Loading = () => {
  return <Spin data-testid='loading-spinner' size={'large'} delay={500}/>
};
