import React from 'react';
import {NavCard} from "./navCard";

export const ContextNavCard = ({context}) => (
  <NavCard
    link={context.url_for}
    icon={context.icon}
    title={context.display()}
  />
)