import React from 'react';
import {NavGridWrapper} from "./cardGrid.style";


export const CardGrid = (props) => (
  <NavGridWrapper className={`grid ${props.className}`}>
    <div className="navItemsContainer">
      <ul>
        {props.children}
      </ul>
    </div>
  </NavGridWrapper>
);
