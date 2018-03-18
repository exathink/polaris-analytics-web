import React from 'react';
import {Tooltip} from 'react-jsx-highcharts';

const tooltipContent = (content) => {
  return content.reduce(
    (tooltip, entry) => tooltip +
      `<tr><td>${entry[0]} </td><td style="text-align: right"><b>${entry[1]}</b></td></tr>`,
    ''
  )
};


export default ({header, body, ...rest}) => (
  <Tooltip
    useHTML={true}
    headerFormat={`<b>${header}</b><br/><br/><table>`}
    pointFormat={tooltipContent(body)}
    footerFormat={'</table>'}
    {...rest}
    />
);

