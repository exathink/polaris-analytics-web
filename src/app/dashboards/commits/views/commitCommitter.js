import React from 'react';
import {Flex} from 'reflexbox';
import {RowNoOverflow} from "../../shared/containers/flex/rowNoOverflow";

export const CommitCommitter = ({commit}) => (
    <RowNoOverflow align={'center'}>
      <i className={"ion ion-code"} style={{margin: '5px'}}/>
      <span>{commit.committer}</span>
    </RowNoOverflow>
);