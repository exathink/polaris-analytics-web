//Given an array of measurements of the form
  // [ {a:x1, b:y1, c:z1, d:v1}, {a:x2, b:y2, c:z2, d: v2}....]
  // where a, b, c etc are 'metric' names and x, y, z, v etc are their (numeric) values,
  //
  // and a single metric name, we return the min and max values for this metric in the set of measurement

export function getMetricRange(measurements, metric) {
  return measurements.reduce(
    ({min, max}, measurement) => ({
      min: Math.min(min, measurement[metric]),
      max: Math.max(max, measurement[metric])
    }),
    {min: Number.MAX_VALUE, max: Number.MIN_VALUE}
  )
}

// This is version of the getMetricRange function that computes metrics for multiple metrics in one shot
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

// Calculation helpers for converting effort to capacity efficiency
// Currently this is pretty kludgy and needs to be beefed up a lot.

export function fteEquivalent(measurementWindow) {
  switch (measurementWindow) {
    case 7:
      return 5;
    case 14:
      return 10;
    case 30:
      return 20;
    case 60:
      return 40;
    case 90:
      return 60;
    default:
      return null;

  }
}

export function getCapacityEfficiency(effort, measurementWindow, contributorCount) {
  if (fteEquivalent(measurementWindow) != null) {
    return (effort / (fteEquivalent(measurementWindow) * contributorCount)) * 100;
  } else {
    return null;
  }
}