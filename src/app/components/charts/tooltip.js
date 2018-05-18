import React from 'react';


const tooltipContent = (content) => {
  return content.reduce(
    (tooltip, entry) => tooltip +
      `<tr><td>${entry[0]} </td>` +
      (entry[1] ? `<td style="text-align: right"><b>${entry[1]}</b></td></tr>`: ''),
    ''
  )
};

export const tooltipHtml = ({header, body}) => (`<b>${header}</b><br/><br/><table>` + tooltipContent(body) + '</table>');

