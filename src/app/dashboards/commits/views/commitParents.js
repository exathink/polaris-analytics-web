import React from 'react';
import {Flex} from 'reflexbox';
import {RowNoOverflow} from "../../shared/containers/flex/rowNoOverflow";

export const CommitParents = ({commit}) => (
  commit.parents?
    <RowNoOverflow align={"center"}>
      <i className={"ion ion-network"} style={{margin: '5px'}}/>
      <span>{commit.parents}</span>
    </RowNoOverflow>
    : null
);