import {useEffect, useState} from 'react';
import {analytics_service} from "../../../../services/graphql";
import {PROJECT_CYCLE_METRICS} from "../queries";
import {fetchQueryEffect} from "../../../../components/graphql/utils";

export function useFetchProjectAggregateCycleMetrics(projectKey, days, targetPercentile, referenceString) {
  const [projectCycleMetrics, setProjectCycleMetrics] = useState({});

  useEffect(fetchQueryEffect({
      service: analytics_service,
      query: PROJECT_CYCLE_METRICS,
      variables: {
        key: projectKey,
        days: days,
        targetPercentile:targetPercentile,
        referenceString: referenceString
      },
      onSuccess: (result) => (
        setProjectCycleMetrics(result.data.project)
      ),
      onError: (error) => {
        console.log(error)
      }
    },
  ), [projectKey])

  return projectCycleMetrics;
}