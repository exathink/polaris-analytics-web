import React from 'react';
import {Flex} from 'reflexbox';


import {capitalizeFirstLetter} from "../../../helpers/utility";
import {CommitCommitter} from "./commitCommitter";
import {CommitDate} from "./commitDate";
import {CommitBranch} from "./commitBranch";
import {CommitRepository} from "./commitRepository";
import {CommitRemoteLink} from "./commitRemoteLink";
import {CommitMessage} from "./commitMessage";

export const CommitDetails = ({commit}) => (
  <Flex column style={{height: "100%"}}>
    <CommitMessage
      message={commit.commitMessage}
      p={'10px'}
      style={{
      height: "85%",
      'font-size': '14pt',
      'border-bottom': '1px solid',
      'overflow-y': 'auto',
    }}/>

    <Flex p={'10px'} style={{height: "15%", 'font-size': '12pt'}}>
      <Flex w={"60%"} align={'center'} justify={'space-between'}>
        <CommitRepository commit={commit}/>
        <CommitCommitter commit={commit}/>
        <CommitDate commit={commit}/>
      </Flex>

      <Flex w={"20%"} align={'center'} justify={'center'}>
        <CommitBranch commit={commit}/>
      </Flex>

      <Flex w={"20%"} align={'center'} justify={'flex-end'}>
        <CommitRemoteLink commit={commit}/>
      </Flex>
    </Flex>
  </Flex>
);

