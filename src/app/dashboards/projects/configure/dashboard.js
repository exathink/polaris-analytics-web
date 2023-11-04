import React from "react";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {ProjectDashboard, useCustomPhaseMapping, useProjectContext} from "../projectDashboard";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";

import {ProjectPipelineFunnelWidget} from "../shared/widgets/funnel";
import {WorkItemStateTypeMapWidget} from "../shared/widgets/workItemStateTypeMap";
import styles from "./dashboard.module.css";
import fontStyles from "../../../framework/styles/fonts.module.css";
import classNames from "classnames";
import Button from "../../../../components/uielements/button";

import {
  MeasurementSettingsDashboard,
  ResponseTimeSLASettingsDashboard,
} from "../../shared/widgets/configure/projectSettingWidgets";

import {CONFIG_TABS, ConfigSelector} from "../../shared/widgets/configure/configSelector/configSelector";

import {PipelineFunnelWidgetInitialInfoConfig} from "../../../components/misc/info/infoContent/pipelineFunnelWidget/infoConfig";
import {DeliveryProcessMappingInitialInfoConfig} from "../../../components/misc/info/infoContent/deliveryProcessMapping/infoConfig";
import {WidgetCore, useWidget} from "../../../framework/viz/dashboard/widgetCore";
import {useQueryProjectValueStreams} from "../shared/hooks/useQueryValueStreams";
import {LabelValue, MutationExecution, useMutationStatus} from "../../../helpers/components";
import {PlusOutlined} from "@ant-design/icons";
import {ValueStreamForm} from "../shared/components/projectValueStreamUtils";
import {ValueStreamEditorTable} from "../shared/components/valueStreamEditorTable";
import {useCreateValueStream} from "../shared/hooks/useCreateValueStream";
import {logGraphQlError} from "../../../components/graphql/utils";
import {Alert, Col, Drawer, Form, Input, Row} from "antd";
import {WorkItemStateTypeDisplayName, WorkItemStateTypes} from "../../shared/config";
import {useDimensionUpdateSettings} from "../../shared/hooks/useQueryProjectUpdateSettings";
import {capitalizeFirstLetter} from "../../../helpers/utility";

const dashboard_id = "dashboards.project.configure";
ValueStreamMappingDashboard.videoConfig = {
  url: "https://vimeo.com/501974487/080d487fcf",
  title: "Configure Dashboard",
  VideoDescription: () => (
    <>
      <h2>Configure Dashboard</h2>
      <p> lorem ipsum Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
    </>
  ),
};

export function ValueStreamMappingInitialDashboard() {
  const {project: {key, settingsWithDefaults}, context} = useProjectContext();

  return (
    <Dashboard
      dashboardVideoConfig={ValueStreamMappingDashboard.videoConfig}
      gridLayout={true}
      className="tw-grid tw-grid-cols-[40%_60%] tw-grid-rows-[auto_1fr_1fr_1fr_1fr_1fr] tw-gap-x-2"
    >
      <DashboardRow>
        <DashboardWidget
          className="tw-col-span-2 tw-col-start-1 tw-row-start-1"
          render={() => (
            <div className="tw-flex tw-flex-col tw-items-center tw-bg-white tw-p-2">
              <div className="tw-flex tw-flex-col tw-items-center" id="state-type-mapping">
                <div className={classNames(fontStyles["text-lg"], fontStyles["font-normal"])}>
                  Let's set up the value stream mapping for this value stream.
                </div>
                <div className={classNames(fontStyles["text-xs"], fontStyles["font-normal"])}>
                  <em>Click on the info icon for more guidance.</em>
                </div>
              </div>
            </div>
          )}
        />
      </DashboardRow>
      <DashboardRow>
        <DashboardWidget
          className="tw-col-start-1 tw-row-span-4 tw-row-start-2"
          name="project-pipeline-detailed"
          infoConfig={PipelineFunnelWidgetInitialInfoConfig}
          render={({view}) => (
            <ProjectPipelineFunnelWidget
              instanceKey={key}
              context={context}
              workItemScope={"all"}
              days={30}
              view={view}
              includeSubTasks={{
                includeSubTasksInClosedState: settingsWithDefaults.includeSubTasksFlowMetrics,
                includeSubTasksInNonClosedState: settingsWithDefaults.includeSubTasksWipInspector,
              }}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          className="tw-col-start-2 tw-row-span-5 tw-row-start-2"
          infoConfig={DeliveryProcessMappingInitialInfoConfig}
          name="workitem-statetype-map"
          render={({view}) => {
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
        />
      </DashboardRow>
    </Dashboard>
  );
}

export function ValueStreamMappingDashboard() {
  const {project: {key, settingsWithDefaults}, context} = useProjectContext();

  const customPhaseMapping = useCustomPhaseMapping();

  const [visible, setVisible] = React.useState(false);
  const [status, updateStatus] = useMutationStatus();

  const dimension = "project";
  // mutation to update project analysis periods
  const [mutate, {loading: mutationLoading, client}] = useDimensionUpdateSettings({
    dimension: dimension,
    onCompleted: ({[`update${capitalizeFirstLetter(dimension)}Settings`]: {success, errorMessage}}) => {
      if (success) {
        updateStatus({mode: "success", message: "Updated Custom Phase Mapping Successfully."});
        client.resetStore();
      } else {
        logGraphQlError("ValueStreamMappingDashboard.useProjectUpdateSettings", errorMessage);
        updateStatus({mode: "error", message: errorMessage});
      }

      setTimeout(() => {
        setVisible(false);
      }, 1000);
    },
    onError: (error) => {
      logGraphQlError("ValueStreamMappingDashboard.useProjectUpdateSettings", error);
      updateStatus({mode: "error", message: error});

      setTimeout(() => {
        setVisible(false);
      }, 1000);
    },
  });

  function handleFinish(values, instanceKey) {
    mutate({
      variables: {
        instanceKey: instanceKey,
        customPhaseMapping: values,
      },
    });
  }

  const drawerElement = ({initialValues, instanceKey}) => (
    <Drawer placement="right" height={355} closable={false} onClose={() => setVisible(false)} visible={visible}>
      <MutationExecution mutationLoading={mutationLoading} status={status}/>
      <div className="tw-flex tw-flex-col tw-gap-8">
        <div className="tw-flex tw-flex-col tw-justify-center tw-border-0 tw-border-b tw-border-solid tw-border-b-gray-200 tw-pb-4">
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
                rules={[{required: true, message: `${WorkItemStateTypeDisplayName.backlog} is required`}]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={WorkItemStateTypeDisplayName.open}
                name={WorkItemStateTypes.open}
                rules={[{required: true, message: `${WorkItemStateTypeDisplayName.open} is required`}]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={WorkItemStateTypeDisplayName.wip}
                name={WorkItemStateTypes.make}
                rules={[{required: true, message: `${WorkItemStateTypeDisplayName.wip} is required`}]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={WorkItemStateTypeDisplayName.complete}
                name={WorkItemStateTypes.deliver}
                rules={[{required: true, message: `${WorkItemStateTypeDisplayName.complete} is required`}]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={WorkItemStateTypeDisplayName.closed}
                name={WorkItemStateTypes.closed}
                rules={[{required: true, message: `${WorkItemStateTypeDisplayName.closed} is required`}]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <div
            className="tw-absolute tw-left-0 tw-bottom-0 tw-w-full tw-bg-white tw-py-4 tw-px-4 tw-text-right"
            style={{borderTop: "1px solid #e9e9e9"}}
          >
            <Button
              onClick={() => {
                setVisible(false);
              }}
              style={{marginRight: 8}}
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
            <div className="tw-absolute tw-top-4 tw-left-1/16 tw-z-20" onClick={handleClick}>
              <Button type="primary">Customize Phase Names</Button>
            </div>
          ),
        ]}
      >
        <DashboardWidget
          className="tw-row-span-4 tw-row-start-2"
          name="project-pipeline-detailed"
          title={" "}
          infoConfig={ProjectPipelineFunnelWidget.infoConfig}
          render={({view}) => (
            <ProjectPipelineFunnelWidget
              instanceKey={key}
              context={context}
              workItemScope={"all"}
              days={30}
              view={view}
              includeSubTasks={{
                includeSubTasksInClosedState: settingsWithDefaults.includeSubTasksFlowMetrics,
                includeSubTasksInNonClosedState: settingsWithDefaults.includeSubTasksWipInspector,
              }}
            />
          )}
          showDetail={true}
        />
        <DashboardWidget
          className="tw-col-start-2 tw-row-span-6 tw-row-start-1"
          title={" "}
          infoConfig={WorkItemStateTypeMapWidget.infoConfig}
          name="workitem-statetype-map"
          render={({view}) => {
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
      {drawerElement({initialValues: customPhaseMapping, instanceKey: key})}
    </Dashboard>
  );
}

export function ValueStreamWorkStreamEditorView({projectKey}) {
  const {data} = useWidget();
  const edges = data.project.valueStreams?.edges ?? [];
  const items = edges.map((edge) => edge.node);

  const tags = data.project.tags ?? [];
  const uniqWorkItemSelectors = [...new Set(tags)];

  const [status, updateStatus] = React.useReducer(
    (data, partialData) => ({
      ...data,
      ...partialData,
    }),
    {mode: "", message: ""}
  );

  const [visible, setVisible] = React.useState(false);
  function onClose() {
    setVisible(false);
  }

  // mutation to create value stream
  const [mutate, {loading: mutationLoading, client}] = useCreateValueStream({
    onCompleted: ({createValueStream}) => {
      if (createValueStream.success) {
        updateStatus({mode: "success", message: "Created Value Stream Successfully."});
        client.resetStore();
      } else {
        logGraphQlError("ValueStreamEditorTable.useUpdateValueStream", createValueStream.errorMessage);
        updateStatus({mode: "error", message: createValueStream.errorMessage});
      }
    },
    onError: (error) => {
      logGraphQlError("ValueStreamEditorTable.useUpdateValueStream", error);
      updateStatus({mode: "error", message: error.message});
    },
  });

  function handleSubmit(values) {
    const payload = {
      name: values.name,
      description: values.description ?? "test",
      workItemSelectors: values.workItemSelectors,
    };
    // call mutation on save button click
    mutate({
      variables: {
        projectKey,
        ...payload,
      },
    });

    onClose();
  }

  return (
    <div className="">
      {mutationLoading && (
        <Button className="tw-ml-auto tw-mr-[90px]" type="primary" loading>
          Processing...
        </Button>
      )}
      {status.mode === "success" && (
        <Alert
          message={status.message}
          type="success"
          showIcon
          closable
          className="tw-ml-auto tw-mr-[90px] tw-w-[300px]"
        />
      )}
      {status.mode === "error" && (
        <Alert
          message={status.message}
          type="error"
          showIcon
          closable
          className="tw-ml-auto tw-mr-[90px] tw-w-[300px]"
        />
      )}
      <div className="tw-flex tw-items-center tw-justify-between">
        <LabelValue label={"Value Streams"} className="tw-ml-2" />
        <Button type="primary" className="tw-mr-2" onClick={() => setVisible(true)}>
          {" "}
          <PlusOutlined /> New Value Stream
        </Button>
        <ValueStreamForm
          formType="NEW_FORM"
          uniqWorkItemSelectors={uniqWorkItemSelectors}
          onSubmit={handleSubmit}
          initialValues={{
            name: "",
            description: "",
            workItemSelectors: [],
          }}
          visible={visible}
          onClose={onClose}
        />
      </div>
      <ValueStreamEditorTable tableData={items} projectKey={projectKey} uniqWorkItemSelectors={uniqWorkItemSelectors} />
    </div>
  );
}

export function ValueStreamWorkStreamEditorWidget({instanceKey, context, view}) {
  const result = useQueryProjectValueStreams({instanceKey});

  return (
    <WidgetCore result={result} errorContext="ValueStreamWorkStreamEditorWidget.useQueryProjectValueStreams">
      {view === "primary" && <ValueStreamWorkStreamEditorView projectKey={instanceKey} />}
    </WidgetCore>
  );
}

export function ValueStreamWorkStreamEditorDashboard({}) {
  const {
    project: {key},
    context,
  } = useProjectContext();

  return (
    <Dashboard gridLayout={true} className="tw-grid tw-grid-cols-5 tw-gap-2">
      <DashboardRow title={""}>
        <DashboardWidget
          className="tw-col-span-3 tw-col-start-2 tw-row-span-6 tw-row-start-1"
          title={" "}
          name="valuestream-workstream-editor"
          render={({view}) => {
            return <ValueStreamWorkStreamEditorWidget instanceKey={key} context={context} view={view} />;
          }}
        />
      </DashboardRow>
    </Dashboard>
  );
}

const componentsMap = {
  [CONFIG_TABS.DELIVERY_PROCESS_MAPPING]: <ValueStreamMappingDashboard />,
  [CONFIG_TABS.VALUE_STREAMS]: <ValueStreamWorkStreamEditorDashboard />,
  [CONFIG_TABS.TIMEBOX_SETTINGS]: <ResponseTimeSLASettingsDashboard dimension={"project"} />,
  [CONFIG_TABS.MEASUREMENT_SETTINGS]: <MeasurementSettingsDashboard dimension={"project"} />,
};

function ConfigDashboard() {
  const {
    project: {mappedWorkStreamCount},
  } = useProjectContext();

  const [configTab, setConfigTab] = React.useState(CONFIG_TABS.DELIVERY_PROCESS_MAPPING);

  const isValueStreamMappingNotDone = mappedWorkStreamCount === 0;
  if (isValueStreamMappingNotDone) {
    return <ValueStreamMappingInitialDashboard />;
  }

  return (
    <Dashboard
      dashboard={`${dashboard_id}`}
      dashboardVideoConfig={ValueStreamMappingDashboard.videoConfig}
      gridLayout={true}
    >
      <DashboardRow
        h={"100%"}
        title={""}
        className={styles.configTab}
        controls={[
          () => (
            <ConfigSelector
              dimension={"project"}
              configTab={configTab}
              setConfigTab={setConfigTab}
              settingsName={"General Settings"}
            />
          ),
        ]}
      >
        {componentsMap[configTab] ?? null}
      </DashboardRow>
    </Dashboard>
  );
}

const dashboard = (({viewerContext}) => (
  <ProjectDashboard>
    <ConfigDashboard />
  </ProjectDashboard>
));

export default dashboard;