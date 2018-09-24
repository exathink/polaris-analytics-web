import React from 'react';
import {Flex} from 'reflexbox';
import {RowNoOverflow} from "../../shared/containers/flex/rowNoOverflow";

export const CommitAuthor = ({commit}) => (
    <RowNoOverflow align={'center'}>
      <i className={"ion ion-ios-people"} style={{margin: '5px'}}/>
      <span>{commit.author}</span>
    </RowNoOverflow>
);