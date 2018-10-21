import React from 'react';
import {Spin} from 'antd';

export const Loading = () => {
  console.log("Loading...");
  return <Spin size={'large'} delay={500}/>
};
