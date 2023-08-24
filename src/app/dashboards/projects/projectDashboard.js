import {gql} from "@apollo/client";
import {Query} from "@apollo/client/react/components"
import React from 'react';
import {analytics_service} from "../../services/graphql";

import {Loading} from "../../components/graphql/loading";
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";
import {DashboardLifecycleManager} from "../../framework/viz/dashboard";


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
    INCLUDE_SUBTASKS_WIP_INSPECTOR: true
  };
  return {
    ...BASE_DEFAULTS,
    LEAD_TIME_CONFIDENCE_TARGET_DEFAULT: BASE_DEFAULTS.RESPONSE_TIME_CONFIDENCE_TARGET_DEFAULT,
    CYCLE_TIME_CONFIDENCE_TARGET_DEFAULT: BASE_DEFAULTS.RESPONSE_TIME_CONFIDENCE_TARGET_DEFAULT,
    LATENCY_TARGET: BASE_DEFAULTS.CYCLE_TIME_TARGET_DEFAULT * 0.1
  };
}

function getProjectSettings({settings: {flowMetricsSettings = {}, analysisPeriods = {}, wipInspectorSettings = {}} = {}}) {
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
    latencyTarget: cycleTimeTarget*0.1 || defaults.LATENCY_TARGET
  };
}

class WithProject extends React.Component {

  onDashboardMounted(project) {
    const isValueStreamMappingNotDone = project.mappedWorkStreamCount === 0;
    
    if (isValueStreamMappingNotDone) {
      const currentUrl = this.props.context.matchInfo.url;

      if (!this.props.context.targetUrl.includes("/configure")) {
        const targetUrl = `${currentUrl}/configure`
        this.props.navigate.push(targetUrl);
      }
    }
  }

  render() {
    const {
      render,
      pollInterval,
      context,
      polling,
    } = this.props;

    return (
      <Query
        client={analytics_service}
        query={gql`
          query with_project_instance($key: String!) {
            project(key: $key, interfaces: [CommitSummary, WorkItemEventSpan, PullRequestEventSpan, OrganizationRef, ProjectSetupInfo]) {
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
              }
            }
          }
        `}
        variables={{
          key: context.getInstanceKey('project')
        }}
        pollInterval={polling ? pollInterval : 0}
      >
        {
          ({loading, error, data}) => {
            if (loading) return <Loading/>;
            if (error) return null;
            const project = data.project;
            const projectWithDefaultSettings = {...project, settingsWithDefaults: getProjectSettings(project)};

            return (
              <DashboardLifecycleManager
                render={render}
                context={context}
                project={projectWithDefaultSettings}
                onMount={
                  () => this.onDashboardMounted(project)
                }
              />
            )
          }
        }
      </Query>
    )
  }
}
export const ProjectDashboard = withNavigationContext(WithProject);


