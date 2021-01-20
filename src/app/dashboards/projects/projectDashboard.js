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
    TRENDS_ANALYSIS_PERIOD: 45
  };
  return {
    ...BASE_DEFAULTS,
    LEAD_TIME_CONFIDENCE_TARGET_DEFAULT: BASE_DEFAULTS.RESPONSE_TIME_CONFIDENCE_TARGET_DEFAULT,
    CYCLE_TIME_CONFIDENCE_TARGET_DEFAULT: BASE_DEFAULTS.RESPONSE_TIME_CONFIDENCE_TARGET_DEFAULT,
  };
}

function getProjectSettings({settings: {flowMetricsSettings = {}, analysisPeriods = {}} = {}}) {
  const {
    leadTimeTarget,
    cycleTimeTarget,
    responseTimeConfidenceTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    wipLimit,
    pipelineMeasurementWindow,
  } = flowMetricsSettings;

  const {
    wipAnalysisPeriod,
    flowAnalysisPeriod,
    trendsAnalysisPeriod,
  } = analysisPeriods

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
    trendsAnalysisPeriod: trendsAnalysisPeriod || defaults.TRENDS_ANALYSIS_PERIOD
  };
}

class WithProject extends React.Component {

  onDashboardMounted(project) {

  }

  render() {
    const {
      render,
      pollInterval,
      context,
      polling,
      enableVideo
    } = this.props;

    return (
      <Query
        client={analytics_service}
        query={
          gql`
            query with_project_instance($key: String!) {
                project(key: $key, interfaces:[CommitSummary, WorkItemEventSpan, PullRequestEventSpan]){
                    id
                    name
                    key
                    earliestCommit
                    latestCommit
                    commitCount
                    latestWorkItemEvent
                    latestPullRequestEvent
                    settings {
                        flowMetricsSettings {
                            cycleTimeTarget
                            leadTimeTarget
                            responseTimeConfidenceTarget
                            leadTimeConfidenceTarget
                            cycleTimeConfidenceTarget
                        }
                        analysisPeriods {
                            wipAnalysisPeriod
                            flowAnalysisPeriod
                            trendsAnalysisPeriod
                        }
                    }
                }
            }
        `
        }
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
                enableVideo={enableVideo}
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


