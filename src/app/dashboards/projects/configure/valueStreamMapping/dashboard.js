/*
 * Copyright (c) Exathink, LLC  2016-2023.
 * All rights reserved
 *
 */

import { ProjectDashboard, useCustomPhaseMapping, useProjectContext } from "../../projectDashboard";
import React from "react";
import { MutationExecution, useMutationStatus } from "../../../../helpers/components";
import { useDimensionUpdateSettings } from "../../../shared/hooks/useQueryProjectUpdateSettings";
import { capitalizeFirstLetter } from "../../../../helpers/utility";
import { logGraphQlError } from "../../../../components/graphql/utils";
import { Col, Drawer, Form, Input, Row } from "antd";
import { WorkItemStateTypeDisplayName, WorkItemStateTypes } from "../../../shared/config";
import Button from "../../../../../components/uielements/button";
import { Dashboard, DashboardRow, DashboardWidget } from "../../../../framework/viz/dashboard";
import { ProjectPipelineFunnelWidget } from "../../shared/widgets/funnel";
import { WorkItemStateTypeMapWidget } from "../../shared/widgets/workItemStateTypeMap";

export function ValueStreamMappingDashboard() {
  const { project: { key, settingsWithDefaults }, context } = useProjectContext();

  const customPhaseMapping = useCustomPhaseMapping();

  const [visible, setVisible] = React.useState(false);
  const [status, updateStatus] = useMutationStatus();

  const dimension = "project";
  // mutation to update project analysis periods
  const [mutate, { loading: mutationLoading, client }] = useDimensionUpdateSettings({
    dimension: dimension,
    onCompleted: ({ [`update${capitalizeFirstLetter(dimension)}Settings`]: { success, errorMessage } }) => {
      if (success) {
        updateStatus({ mode: "success", message: "Updated Custom Phase Mapping Successfully." });
        client.resetStore();
      } else {
        logGraphQlError("ValueStreamMappingDashboard.useProjectUpdateSettings", errorMessage);
        updateStatus({ mode: "error", message: errorMessage });
      }

      setTimeout(() => {
        setVisible(false);
      }, 1000);
    },
    onError: (error) => {
      logGraphQlError("ValueStreamMappingDashboard.useProjectUpdateSettings", error);
      updateStatus({ mode: "error", message: error });

      setTimeout(() => {
        setVisible(false);
      }, 1000);
    }
  });

  function handleFinish(values, instanceKey) {
    mutate({
      variables: {
        instanceKey: instanceKey,
        customPhaseMapping: values
      }
    });
  }

  const drawerElement = ({ initialValues, instanceKey }) => (
    <Drawer placement="right" height={355} closable={false} onClose={() => setVisible(false)} visible={visible}>
      <MutationExecution mutationLoading={mutationLoading} status={status} />
      <div className="tw-flex tw-flex-col tw-gap-8">
        <div
          className="tw-flex tw-flex-col tw-justify-center tw-border-0 tw-border-b tw-border-solid tw-border-b-gray-200 tw-pb-4">
          <div className="tw-text-xl">Customize Phase Names</div>
          <div className="tw-text-xs">Applies to all Workstreams in this Value Stream</div>
        </div>
        <Form
          key={visible}
          layout="vertical"
          requiredMark
          onFinish={(values) => handleFinish(values, instanceKey)}
          initialValues={initialValues}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label={WorkItemStateTypeDisplayName.backlog}
                name={WorkItemStateTypes.backlog}
                rules={[{ required: true, message: `${WorkItemStateTypeDisplayName.backlog} is required` }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={WorkItemStateTypeDisplayName.open}
                name={WorkItemStateTypes.open}
                rules={[{ required: true, message: `${WorkItemStateTypeDisplayName.open} is required` }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={WorkItemStateTypeDisplayName.wip}
                name={WorkItemStateTypes.make}
                rules={[{ required: true, message: `${WorkItemStateTypeDisplayName.wip} is required` }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={WorkItemStateTypeDisplayName.complete}
                name={WorkItemStateTypes.deliver}
                rules={[{ required: true, message: `${WorkItemStateTypeDisplayName.complete} is required` }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={WorkItemStateTypeDisplayName.closed}
                name={WorkItemStateTypes.closed}
                rules={[{ required: true, message: `${WorkItemStateTypeDisplayName.closed} is required` }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <div
            className="tw-absolute tw-left-0 tw-bottom-0 tw-w-full tw-bg-white tw-py-4 tw-px-4 tw-text-right"
            style={{ borderTop: "1px solid #e9e9e9" }}
          >
            <Button
              onClick={() => {
                setVisible(false);
              }}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>

            <Button htmlType="submit" type="primary">
              Ok
            </Button>
          </div>
        </Form>
      </div>
    </Drawer>
  );

  function handleClick() {
    setVisible(true);
  }

  return (
    <Dashboard
      dashboardVideoConfig={ValueStreamMappingDashboard.videoConfig}
      gridLayout={true}
      className="tw-relative tw-grid tw-grid-cols-[40%_60%] tw-grid-rows-6 tw-gap-2"
    >
      <DashboardRow
        title={" "}
        controls={[
          () => (
            <div className="tw-absolute tw-top-6 tw-left-1/16 tw-z-20" onClick={handleClick}>
              <Button type="primary">Customize Phase Names</Button>
            </div>
          )
        ]}
      >
        <DashboardWidget
          className="tw-row-span-4 tw-row-start-2"
          name="project-pipeline-detailed"
          title={" "}
          infoConfig={ProjectPipelineFunnelWidget.infoConfig}
          render={({ view }) => (
            <ProjectPipelineFunnelWidget
              instanceKey={key}
              context={context}
              workItemScope={"all"}
              days={30}
              view={view}
              includeSubTasks={{
                includeSubTasksInClosedState: settingsWithDefaults.includeSubTasksFlowMetrics,
                includeSubTasksInNonClosedState: settingsWithDefaults.includeSubTasksWipInspector
              }}
            />
          )}
          showDetail={true}
          detailTooltipTitle={"Show Details"}
        />
        <DashboardWidget
          className="tw-col-start-2 tw-row-span-6 tw-row-start-1"
          title={" "}
          infoConfig={WorkItemStateTypeMapWidget.infoConfig}
          name="workitem-statetype-map"
          render={({ view }) => {
            return (
              <WorkItemStateTypeMapWidget
                instanceKey={key}
                context={context}
                days={30}
                view={view}
                showMeLinkVisible={true}
              />
            );
          }}
          showDetail={true}
        />

      </DashboardRow>
      {drawerElement({ initialValues: customPhaseMapping, instanceKey: key })}
    </Dashboard>
  );
}

const dashboard = (({viewerContext}) => (
  <ProjectDashboard>
    <ValueStreamMappingDashboard/>
  </ProjectDashboard>
));

export default dashboard;