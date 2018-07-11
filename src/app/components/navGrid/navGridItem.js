import React from 'react';
import {SingleCardWrapper} from "./navGrid.style";
import {Link} from 'react-router-dom';

export const NavGridItem = props => (
  <SingleCardWrapper id={'1'} className={'grid'}>
    <Link to={props.link}>
      <div className="isoCardImage">
        <i
          className={`ion ${props.icon}`}
        />
      </div>
      <div className="isoCardContent">
        <h3 className="isoCardTitle">{props.title}</h3>
      </div>
    </Link>
  </SingleCardWrapper>
);
