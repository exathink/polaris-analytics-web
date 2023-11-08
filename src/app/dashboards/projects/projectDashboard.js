import {gql, useQuery} from "@apollo/client";
import React from 'react';
import {analytics_service} from "../../services/graphql";

import {Loading} from "../../components/graphql/loading";
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";
import { logGraphQlError } from "../../components/graphql/utils";
import { WorkItemStateTypeDisplayName } from "../shared/config";

export const ProjectContext = React.createContext();

export function useProjectContext(selectorFn) {
  const context = React.useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjectContext hook must be used within a Provider");
  }
  return selectorFn?.(context) ?? context;
}

// get customPhaseMapping using project dimension query
export function useCustomPhaseMapping() {
  const {project} = useProjectContext();

  const result = React.useMemo(() => {
    const _customPhaseMapping = project?.settings?.customPhaseMapping ?? {};

    const {__typename, ...customPhaseMapping} = _customPhaseMapping;

    const mapping = Object.keys(customPhaseMapping).reduce((acc, phaseKey) => {
      if (acc[phaseKey] == null) {
        acc[phaseKey] = WorkItemStateTypeDisplayName[phaseKey];
      }
      return acc;
    }, customPhaseMapping);

    return {unmapped: "Unmapped", ...mapping};
  }, [project]);

  return result;
}

export const PROJECT_QUERY = gql`
  query projectInstance($key: String!) {
    project(
      key: $key
      interfaces: [CommitSummary, WorkItemEventSpan, PullRequestEventSpan, OrganizationRef, ProjectSetupInfo]
    ) {
      id
      name
      key
      workStreamCount
      mappedWorkStreamCount
      earliestCommit
      latestCommit
      commitCount
      latestWorkItemEvent
      latestPullRequestEvent
      organizationKey
      valueStreams {
        edges {
          node {
            key
            name
            description
            workItemSelectors
          }
        }
      }
      settings {
        flowMetricsSettings {
          cycleTimeTarget
          leadTimeTarget
          responseTimeConfidenceTarget
          leadTimeConfidenceTarget
          cycleTimeConfidenceTarget
          includeSubTasks
        }
        analysisPeriods {
          wipAnalysisPeriod
          flowAnalysisPeriod
          trendsAnalysisPeriod
        }
        wipInspectorSettings {
          includeSubTasks
        }
        releasesSettings {
          enableReleases
        }
        customPhaseMapping {
          backlog
          open
          wip
          complete
          closed
        }
      }
    }
  }
`;

export function useProjectQuery({key, ...restProps}) {
  return useQuery(PROJECT_QUERY, {
    service: analytics_service,
    variables: {
      key: key,
      ...restProps,
    },
    errorPolicy: "all",
  });
}

function PROJECT_DEFAULT_SETTINGS() {
  const BASE_DEFAULTS = {
    LEAD_TIME_TARGET_DEFAULT: 30,
    CYCLE_TIME_TARGET_DEFAULT: 7,
    RESPONSE_TIME_CONFIDENCE_TARGET_DEFAULT: 1.0,
    WIP_LIMIT_DEFAULT: 20,
    PIPELINE_MEASUREMENT_WINDOW_DEFAULT: 7,
    WIP_ANALYSIS_PERIOD: 14,
    FLOW_ANALYSIS_PERIOD: 30,
    TRENDS_ANALYSIS_PERIOD: 45,
    INCLUDE_SUBTASKS_FLOW_METRICS: false,
    INCLUDE_SUBTASKS_WIP_INSPECTOR: true,
    ENABLE_RELEASES: false,
  };
  return {
    ...BASE_DEFAULTS,
    LEAD_TIME_CONFIDENCE_TARGET_DEFAULT: BASE_DEFAULTS.RESPONSE_TIME_CONFIDENCE_TARGET_DEFAULT,
    CYCLE_TIME_CONFIDENCE_TARGET_DEFAULT: BASE_DEFAULTS.RESPONSE_TIME_CONFIDENCE_TARGET_DEFAULT,
    LATENCY_TARGET: BASE_DEFAULTS.CYCLE_TIME_TARGET_DEFAULT * 0.1
  };
}

function getProjectSettings({settings: {flowMetricsSettings = {}, analysisPeriods = {}, wipInspectorSettings = {}, releasesSettings = {}} = {}}) {
  const {
    leadTimeTarget,
    cycleTimeTarget,
    responseTimeConfidenceTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    wipLimit,
    pipelineMeasurementWindow,
    includeSubTasks: includeSubTasksFlowMetrics
  } = flowMetricsSettings;

  const {
    wipAnalysisPeriod,
    flowAnalysisPeriod,
    trendsAnalysisPeriod,
  } = analysisPeriods

  const {
    includeSubTasks: includeSubTasksWipInspector
  } = wipInspectorSettings;

  const {enableReleases} = releasesSettings;

  const defaults = PROJECT_DEFAULT_SETTINGS();
  return {
    leadTimeTarget: leadTimeTarget || defaults.LEAD_TIME_TARGET_DEFAULT,
    cycleTimeTarget: cycleTimeTarget || defaults.CYCLE_TIME_TARGET_DEFAULT,
    responseTimeConfidenceTarget: responseTimeConfidenceTarget || defaults.RESPONSE_TIME_CONFIDENCE_TARGET_DEFAULT,
    leadTimeConfidenceTarget: leadTimeConfidenceTarget || defaults.LEAD_TIME_CONFIDENCE_TARGET_DEFAULT,
    cycleTimeConfidenceTarget: cycleTimeConfidenceTarget || defaults.CYCLE_TIME_CONFIDENCE_TARGET_DEFAULT,
    wipLimit: wipLimit || defaults.WIP_LIMIT_DEFAULT,
    pipelineMeasurementWindow: pipelineMeasurementWindow || defaults.PIPELINE_MEASUREMENT_WINDOW_DEFAULT,
    wipAnalysisPeriod: wipAnalysisPeriod || defaults.WIP_ANALYSIS_PERIOD,
    flowAnalysisPeriod: flowAnalysisPeriod || defaults.FLOW_ANALYSIS_PERIOD,
    trendsAnalysisPeriod: trendsAnalysisPeriod || defaults.TRENDS_ANALYSIS_PERIOD,
    includeSubTasksFlowMetrics: includeSubTasksFlowMetrics == null ? defaults.INCLUDE_SUBTASKS_FLOW_METRICS : includeSubTasksFlowMetrics,
    includeSubTasksWipInspector: includeSubTasksWipInspector == null ? defaults.INCLUDE_SUBTASKS_WIP_INSPECTOR : includeSubTasksWipInspector,
    latencyTarget: cycleTimeTarget*0.1 || defaults.LATENCY_TARGET,
    enableReleases: enableReleases || defaults.ENABLE_RELEASES
  };
}

export function WithProject({context, navigate, children, polling, pollInterval}) {
  const {loading, error, data} = useProjectQuery({key: context.getInstanceKey("project"), pollInterval: polling ? pollInterval : 0});

  function onDashboardMounted(project) {
    const isValueStreamMappingNotDone = project.mappedWorkStreamCount === 0;

    if (isValueStreamMappingNotDone) {
      const currentUrl = context.matchInfo.url;

      if (!context.targetUrl.includes("/configure")) {
        const targetUrl = `${currentUrl}/configure`;
        navigate.push(targetUrl);
      }
    }
  }

  React.useEffect(() => {
    if (data) {
      onDashboardMounted(data.project);
    }
  }, [data]);

  if (loading) {
    return <Loading />;
  }
  if (error) {
    logGraphQlError(`useProjectQuery`, error);
    return null;
  }

  return (
    <ProjectContext.Provider
      value={{
        project: {...data.project, settingsWithDefaults: getProjectSettings(data.project), dimension: "project"},
        context,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export const ProjectDashboard = withNavigationContext(WithProject);


