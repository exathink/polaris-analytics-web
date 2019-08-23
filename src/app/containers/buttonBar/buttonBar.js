import React from 'react';
import {Col} from 'antd'
import './buttonBar.css';

export const ButtonBar = props => (
  <div className={'button-bar'}>
    {props.children}
  </div>
)

export const ButtonBarColumn = props => {
  return (
    <Col span={props.span} style={{textAlign: props.alignButton}}>
      {props.children}
    </Col>
  )
}
