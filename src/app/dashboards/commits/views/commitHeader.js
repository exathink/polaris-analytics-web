import React from 'react';
import {Flex, Box} from 'reflexbox';
import moment from 'moment';

import {elide, capitalizeFirstLetter} from "../../../helpers/utility";
import {Colors} from "../../shared/config";
import {CommitAuthor} from "./commitAuthor";
import {CommitDate} from "./commitDate";
import {CommitBranch} from "./commitBranch";
import {CommitParents} from "./commitParents";
import {CommitRepository} from "./commitRepository";
import {CommitRemoteLink} from "./commitRemoteLink";

export const CommitHeader = ({commit}) => (
  <Flex column style={{height:"100%"}}>
    <Flex p={'10px'} style={{
      height: "85%",
      'font-size': '14pt',
      'border-bottom': '1px solid',
      'overflow-y': 'auto',
    }}>
      {capitalizeFirstLetter(commit.commitMessage)}
    </Flex>
    <Flex p={'10px'} style={{height: "15%", 'font-size': '12pt'}}>
      <Flex w={1/2} align={'center'} justify={'space-between'}>
        <CommitRepository commit={commit}/>
        <CommitAuthor commit={commit}/>
        <CommitDate commit={commit}/>
      </Flex>

      <Flex w={1 / 4} align={'center'} justify={'center'}>
        <CommitBranch commit={commit}/>
      </Flex>

      <Flex w={1 / 4} align={'center'} justify={'flex-end'}>
        <CommitRemoteLink commit={commit}/>
      </Flex>
    </Flex>
  </Flex>
);