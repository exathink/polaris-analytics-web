// Given an array of measurements of the form
  // [ {a:x1, b:y1, c:z1, d:v1}, {a:x2, b:y2, c:z2, d: v2}....]
  // where a, b, c etc are 'metric' names and x, y, z, v etc are their (numeric) values,
  // we return an object of the form
  // {
  //   a: {min: value, max: value},
  //   b: {min: value, max: value},
  //   c: {min: value, max: value}
  // }
  // for those metric names that are specified in the metrics array.
  // This method returns an aggregate on the min and max value of the specified metrics over the array
  // of measurements.

export function getMetricsRange(measurements, metrics) {

  const initial = metrics.reduce(
    (initial, metric) => {
      initial[metric] = {
        min: Number.MAX_VALUE,
        max: Number.MIN_VALUE
      };
      return initial
    },
    {}
  )
  return measurements.reduce(
    (metricsRange, measurement) => metrics.reduce(
      (result, metric) => {
        result[metric] = {
          min: Math.min(result[metric].min, measurement[metric]),
          max: Math.max(result[metric].max, measurement[metric])
        };
        return result
      },
      metricsRange
    ),
    initial
  )
}

// Given two numbers a and b where a <= b, we return the difference
// between the two numbers as a percentage of the smallest value.
export function getPercentSpread(min, max) {
  return ((max - min) / (min)) * 100;
}