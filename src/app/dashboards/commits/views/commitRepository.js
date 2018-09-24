import React from 'react';
import {Contexts} from "../../../meta";
import {Flex} from 'reflexbox';
import {RowNoOverflow} from "../../shared/containers/flex/rowNoOverflow";

export const CommitRepository = ({commit}) => (
    <RowNoOverflow align={'center'}>
      <i className={`ion ${Contexts.repositories.icon}`} style={{margin: '5px'}}/>
      <span>{commit.repository}</span>
    </RowNoOverflow>
);