const tooltipContent = (content) => {
  return content.reduce(
    (tooltip, entry) => tooltip +
      `<tr><td>${entry[0]} </td>` +
      (entry[1] ? `<td style="text-align: right"><b>${entry[1]}</b></td></tr>`: ''),
    ''
  )
};

export const tooltipHtml = ({header, body}) => (`<div style="padding: 7px; background-color: rgba(255, 255, 255, 0.9);"><b>${header}</b><br/><br/><table>` + tooltipContent(body) + '</table></div>');

/** Functions to extract previous and next points from within a formatter callback */

export function previousPoint(formatterThis) {
  const points = formatterThis.series.points;
  const index = points.indexOf(formatterThis.point);
  return index > 0 ? points[index-1] : null;
}

export function nextPoint(formatterThis) {
  const points = formatterThis.series.points;
  const index = points.indexOf(formatterThis.point);
  return index < points.length - 1 ? points[index+1] : null;
}