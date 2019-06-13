import React from 'react';
import './buttonBar.css';

export const ButtonBar = props => (
  <div className={'button-bar'}>
    {props.children}
  </div>
)