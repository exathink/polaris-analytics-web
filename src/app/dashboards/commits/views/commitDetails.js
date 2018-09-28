import React from 'react';
import {Flex, Box} from 'reflexbox';
import moment from 'moment';

import {elide, capitalizeFirstLetter} from "../../../helpers/utility";
import {Colors} from "../../shared/config";
import {CommitCommitter} from "./commitCommitter";
import {CommitDate} from "./commitDate";
import {CommitBranch} from "./commitBranch";
import {CommitParents} from "./commitParents";
import {CommitRepository} from "./commitRepository";
import {CommitRemoteLink} from "./commitRemoteLink";

export const CommitDetails = ({commit}) => (
  <Flex column style={{height:"100%"}}>
    <Flex p={'10px'} style={{
      height: "85%",
      'font-size': '14pt',
      'border-bottom': '1px solid',
      'overflow-y': 'auto',
    }}>
      {replace_url_with_links(capitalizeFirstLetter(commit.commitMessage))}
    </Flex>
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

export function replace_url_with_links(text) {
  const url_regex = /(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/g;
  const segments = [];
  let scan_index = 0;
  let match = url_regex.exec(text);
  while (match !== null) {
    const url = match[0];
    const prefix = text.substring(scan_index, match.index);
    segments.push([prefix, url]);
    scan_index = url_regex.lastIndex;
    match = url_regex.exec(text);
  }
  if (scan_index < text.length) {
    segments.push([text.substring(scan_index), undefined])
  }


  return (
    <span>
      {
        segments.map(
          ([prefix, url]) => (
            <span>
              {prefix}
              {
                url ? <a href={url} target={"_blank"}>{url}</a> : null
              }
            </span>
        ))
      }
    </span>
  )
}