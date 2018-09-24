import React from 'react';
import {Flex} from 'reflexbox';
import {RowNoOverflow} from "../../shared/containers/flex/rowNoOverflow";

export const CommitBranch = ({commit}) => (
  commit.branch?
    <RowNoOverflow align={'center'}>
      <i className={"ion ion-merge"} style={{margin: '5px'}}/>
      <span>{commit.branch}</span>
    </RowNoOverflow>
    : null
);