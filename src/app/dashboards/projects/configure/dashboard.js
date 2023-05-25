import React from "react";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {ProjectDashboard} from "../projectDashboard";
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
} from "../../shared/widgets/configure/settingWidgets";

import {CONFIG_TABS, ConfigSelector} from "../../shared/widgets/configure/configSelector/configSelector";

import {PipelineFunnelWidgetInitialInfoConfig} from "../../../components/misc/info/infoContent/pipelineFunnelWidget/infoConfig";
import {DeliveryProcessMappingInitialInfoConfig} from "../../../components/misc/info/infoContent/deliveryProcessMapping/infoConfig";
import {WidgetCore, useWidget} from "../../../framework/viz/dashboard/widgetCore";
import {useQueryProjectValueStreams} from "../shared/hooks/useQueryValueStreams";
import {StripeTable} from "../../../components/tables/tableUtils";
import {CustomTag, LabelValue} from "../../../helpers/components";

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
  return (
    <ProjectDashboard
      render={({project: {key, settingsWithDefaults}, context}) => {
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
                        Configure the delivery process mapping for this value stream
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
      }}
    />
  );
}

export function ValueStreamMappingDashboard() {
  return (
    <ProjectDashboard
      render={({project: {key, settingsWithDefaults}, context}) => {
        return (
          <Dashboard
            dashboardVideoConfig={ValueStreamMappingDashboard.videoConfig}
            gridLayout={true}
            className="tw-grid tw-grid-cols-[40%_60%] tw-grid-rows-6 tw-gap-2"
          >
            <DashboardRow title={" "}>
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
                showDetail={false}
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
              />
            </DashboardRow>
          </Dashboard>
        );
      }}
    />
  );
}

function useValueStreamEditorColumns() {
  return [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "25%",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "20%",
    },
    {
      title: "Tags",
      dataIndex: "workItemSelectors",
      key: "workItemSelectors",
      width: "20%",
      render: (text, record) => {
        return (
          <div>
            {record.workItemSelectors.map((w) => (
              <CustomTag key={w}>{w}</CustomTag>
            ))}
          </div>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      width: "20%",
      render: (text, record) => {
        return (
          <div className="tw-flex tw-justify-center tw-gap-4">
            <Button type="primary" size="small">
              Edit
            </Button>{" "}
            <Button type="danger" size="small">
              Delete
            </Button>
          </div>
        );
      },
    },
  ];
}

export function ValueStreamEditorTable({tableData}) {
  const columns = useValueStreamEditorColumns();

  return <StripeTable dataSource={tableData} columns={columns} />;
}

export function ValueStreamWorkStreamEditorView({}) {
  const {data} = useWidget();
  const edges = data.project.valueStreams?.edges ?? [];
  const items = edges.map((edge) => edge.node);

  return (
    <div className="">
      <div className="tw-flex tw-items-center tw-justify-between">
        <LabelValue label={"Value Streams"} className="tw-ml-2" />
        <Button type="primary">New Value Stream</Button>
      </div>
      <ValueStreamEditorTable tableData={items} />
    </div>
  );
}

export function ValueStreamWorkStreamEditorWidget({instanceKey, context, view}) {
  const result = useQueryProjectValueStreams({instanceKey});

  return (
    <WidgetCore result={result} errorContext="ValueStreamWorkStreamEditorWidget.useQueryProjectValueStreams">
      {view === "primary" && <ValueStreamWorkStreamEditorView />}
    </WidgetCore>
  );
}

export function ValueStreamWorkStreamEditorDashboard({}) {
  return (
    <ProjectDashboard
      render={({project: {key, settingsWithDefaults}, context}) => {
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
      }}
    />
  );
}

const componentsMap = {
  [CONFIG_TABS.DELIVERY_PROCESS_MAPPING]: <ValueStreamMappingDashboard />,
  [CONFIG_TABS.VALUE_STREAMS]: <ValueStreamWorkStreamEditorDashboard />,
  [CONFIG_TABS.RESPONSE_TIME_SLA]: <ResponseTimeSLASettingsDashboard dimension={"project"} />,
  [CONFIG_TABS.MEASUREMENT_SETTINGS]: <MeasurementSettingsDashboard dimension={"project"} />,
};

export default withViewerContext(({viewerContext}) => {
  const [configTab, setConfigTab] = React.useState(CONFIG_TABS.DELIVERY_PROCESS_MAPPING);

  return (
    <ProjectDashboard
      render={({project: {key, mappedWorkStreamCount}}) => {
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
                    settingsName={"Value Stream Settings"}
                  />
                ),
              ]}
            >
              {componentsMap[configTab] ?? null}
            </DashboardRow>
          </Dashboard>
        );
      }}
    />
  );
});
