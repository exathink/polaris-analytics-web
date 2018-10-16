import React from 'react';
import {Flex} from "reflexbox";

export function commit_message_text_to_tree(text) {
  const url_regex = /(http|https|ftp|ftps):\/\/[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,3}(\/\S*)?/g;
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
    <React.Fragment>
      {
        segments.map(
          ([prefix, url]) => (
            <React.Fragment>
              {
                prefix.split('\n').map(
                  phrase => (
                      <React.Fragment>
                        {phrase}
                        <br/>
                      </React.Fragment>
                ))
              }
              {
                url ? <a href={url} target={"_blank"}>{url}</a> : null
              }
            </React.Fragment>
          ))
      }
    </React.Fragment>
  )
}
export const CommitMessage = ({message, ...rest}) => (
  <Flex  column {...rest}>
    {commit_message_text_to_tree(message)}
  </Flex>
);
