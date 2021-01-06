export function addIdsToChartPoints(chart, mapper = (points) => points, seriesIndex = 0) {
  const {points} = chart.series[seriesIndex];
  const testPoints = mapper(points);
  testPoints.forEach((point, pointIndex) => {
    const pointGraphicElem = point.graphic.element;
    pointGraphicElem.setAttribute("data-testid", `point-${pointIndex}`);
  });
}
