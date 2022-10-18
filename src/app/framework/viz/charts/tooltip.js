const tooltipContent = (content) => {
  return content.reduce(
    (tooltip, entry) => tooltip +
      `<tr><td>${entry[0]} </td>` +
      (entry[1] ? `<td style="text-align: right"><b>${entry[1]}</b></td></tr>`: ''),
    ''
  )
};

export const tooltipHtml = ({header, body}) => (`<div style="padding: 7px; background-color: rgba(255, 255, 255, 0.9);"><b>${header}</b><br/><br/><table>` + tooltipContent(body) + '</table></div>');


// with empty array we can insert a divider
const tooltipContent_v2 = (content) => {
  return content.reduce((tooltip, [entry1, entry2]) => {
    if (entry1===undefined && entry2===undefined) {
      return tooltip + `<div class="tw-border-0 tw-border-b tw-border-b-gray-200 tw-border-solid tw-my-2"></div>`
    }
    return (
      tooltip +
      `<div class="pair tw-flex tw-items-baseline tw-space-x-2">
         <div class="label tw-text-sm tw-tracking-wide">${entry1}</div>` +
      (entry2 ? `<div class="value tw-text-base tw-text-black">${entry2}</div></div>` : "</div>")
    );
  }, "");
};

export const tooltipHtml_v2 = ({header, body}) => (`
<div class="tw-bg-white/90 tw-p-2 tw-text-gray-300">
  <div class="tw-text-lg tw-tracking-wide tw-border-0 tw-border-b tw-border-b-gray-200 tw-border-solid tw-pb-2">${header}</div>
  <div class="body tw-pt-2">
    ${tooltipContent_v2(body)}
  </div>
</div>`);

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