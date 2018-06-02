const getDataRanges = (props, initializer= {x: {min: 0, max: 0}, y: {min: 1, max: 0}}) => {
  return props.model.data.reduce(
    (ranges, point) => ({
      x: {
        min: Math.min(point.x, ranges.x.min),
        max: Math.max(point.x, ranges.x.max)
      },
      y: {
        min: Math.min(point.y, ranges.y.min),
        max: Math.max(point.y, ranges.y.max)
      }
    }), initializer);
};
