/*
 * Copyright (c) Exathink, LLC  2016-2023.
 * All rights reserved
 *
 */

import { ProjectDashboard, useProjectContext } from "../projectDashboard";
import React from "react";
import { useWidget, WidgetCore } from "../../../framework/viz/dashboard/widgetCore";
import { useCreateValueStream } from "../shared/hooks/useCreateValueStream";
import { logGraphQlError } from "../../../components/graphql/utils";
import Button from "../../../../components/uielements/button";
import { Alert } from "antd";
import { LabelValue } from "../../../helpers/components";
import { PlusOutlined } from "@ant-design/icons";
import { ValueStreamForm } from "../shared/components/projectValueStreamUtils";
import { ValueStreamEditorTable } from "../shared/components/valueStreamEditorTable";
import { useQueryProjectValueStreams } from "../shared/hooks/useQueryValueStreams";
import { Dashboard, DashboardRow, DashboardWidget } from "../../../framework/viz/dashboard";

export function ValueStreamWorkStreamEditorView({ projectKey }) {
  const { data } = useWidget();
  const edges = data.project.valueStreams?.edges ?? [];
  const items = edges.map((edge) => edge.node);

  const tags = data.project.tags ?? [];
  const uniqWorkItemSelectors = [...new Set(tags)];

  const [status, updateStatus] = React.useReducer(
    (data, partialData) => ({
      ...data,
      ...partialData
    }),
    { mode: "", message: "" }
  );

  const [visible, setVisible] = React.useState(false);

  function onClose() {
    setVisible(false);
  }

  // mutation to create value stream
  const [mutate, { loading: mutationLoading, client }] = useCreateValueStream({
    onCompleted: ({ createValueStream }) => {
      if (createValueStream.success) {
        updateStatus({ mode: "success", message: "Created Value Stream Successfully." });
        client.resetStore();
      } else {
        logGraphQlError("ValueStreamEditorTable.useUpdateValueStream", createValueStream.errorMessage);
        updateStatus({ mode: "error", message: createValueStream.errorMessage });
      }
    },
    onError: (error) => {
      logGraphQlError("ValueStreamEditorTable.useUpdateValueStream", error);
      updateStatus({ mode: "error", message: error.message });
    }
  });

  function handleSubmit(values) {
    const payload = {
      name: values.name,
      description: values.description ?? "test",
      workItemSelectors: values.workItemSelectors
    };
    // call mutation on save button click
    mutate({
      variables: {
        projectKey,
        ...payload
      }
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
          <PlusOutlined /> Value Stream
        </Button>
        <ValueStreamForm
          formType="NEW_FORM"
          uniqWorkItemSelectors={uniqWorkItemSelectors}
          onSubmit={handleSubmit}
          initialValues={{
            name: "",
            description: "",
            workItemSelectors: []
          }}
          visible={visible}
          onClose={onClose}
        />
      </div>
      <ValueStreamEditorTable tableData={items} projectKey={projectKey} uniqWorkItemSelectors={uniqWorkItemSelectors} />
    </div>
  );
}

export function ValueStreamWorkStreamEditorWidget({ instanceKey, context, view }) {
  const result = useQueryProjectValueStreams({ instanceKey });

  return (
    <WidgetCore result={result} errorContext="ValueStreamWorkStreamEditorWidget.useQueryProjectValueStreams">
      {view === "primary" && <ValueStreamWorkStreamEditorView projectKey={instanceKey} />}
    </WidgetCore>
  );
}

export function ValueStreamWorkStreamEditorDashboard({}) {
  const {
    project: { key },
    context
  } = useProjectContext();

  return (
    <Dashboard gridLayout={true} className="tw-grid tw-grid-cols-5 tw-gap-2">
      <DashboardRow title={""}>
        <DashboardWidget
          className="tw-col-span-3 tw-col-start-2 tw-row-span-6 tw-row-start-1"
          title={" "}
          name="valuestream-workstream-editor"
          render={({ view }) => {
            return <ValueStreamWorkStreamEditorWidget instanceKey={key} context={context} view={view} />;
          }}
        />
      </DashboardRow>
    </Dashboard>
  );
}

const dashboard = (({viewerContext}) => (
  <ProjectDashboard>
    <ValueStreamWorkStreamEditorDashboard/>
  </ProjectDashboard>
));

export default dashboard;