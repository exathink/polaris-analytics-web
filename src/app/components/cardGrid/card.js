import React from 'react';
import {SingleCardWrapper} from "./cardGrid.style";

export const Card = props => (
  <SingleCardWrapper className={'grid'} {...props}>
    {props.children}
  </SingleCardWrapper>
);