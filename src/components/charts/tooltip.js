import React from 'react';
import {Tooltip} from 'react-jsx-highcharts';

const tooltipContent = (content) => {
  return content.reduce(
    (tooltip, entry) => tooltip +
      `<tr><td>${entry[0]} </td>` +
      (entry[1] ? `<td style="text-align: right"><b>${entry[1]}</b></td></tr>`: ''),
    ''
  )
};

export const tooltipHtml = ({header, body}) => (`<b>${header}</b><br/><br/><table>` + tooltipContent(body) + '</table>');

const formatToolTip = (point, formatter) => formatter(point);

export const TooltipWrapper = ({formatter, ...rest}) => {
  const formatterDelegate= function () {return formatToolTip(this, formatter)};
  return <Tooltip {...rest} {...(formatter? {formatter: formatterDelegate} : {})}/>
}