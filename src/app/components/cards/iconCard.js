import React from "react";
import {SingleCardWrapper} from "../cardGrid/cardGrid.style";


export const IconCard = ({icon, title}) => (
  <SingleCardWrapper id={'1'} className={'grid'}>
      <div className="isoCardImage">
        <i
          className={`ion ${icon}`}
        />
      </div>
      <div className="isoCardContent">
        <h3 className="isoCardTitle">{title}</h3>
      </div>
  </SingleCardWrapper>
);