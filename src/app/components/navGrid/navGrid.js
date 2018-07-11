import React from 'react';
import {NavGridWrapper} from "./navGrid.style";


export const NavGrid = (props) => (
  <NavGridWrapper className={`grid ${props.className}`}>
    <div className="navItemsContainer">
      <ul>
        {props.children}
      </ul>
    </div>
  </NavGridWrapper>
);
