import React from "react";
import {ValueStreamForm} from "./projectValueStreamUtils";
import Button from "../../../../../components/uielements/button";
import {StripeTable} from "../../../../components/tables/tableUtils";
import {CustomTag} from "../../../../helpers/components";
import {logGraphQlError} from "../../../../components/graphql/utils";
import {useEditValueStream} from "../../shared/hooks/useEditValueStream";
import {Alert} from "antd";

function useValueStreamEditorColumns() {
  const [currentRecord, setCurrentRecord] = React.useState();

  const [visible, setVisible] = React.useState(false);
  function onClose() {
    setVisible(false);
  }

  const columns = [
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
      title: "Activity Tags",
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
          <div className="tw-flex tw-justify-center tw-gap-4" key={record.name}>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setCurrentRecord(record);
                setVisible(true);
              }}
            >
              Edit
            </Button>
          </div>
        );
      },
    },
  ];
  return {columns, currentRecord, visible, onClose};
}

export function ValueStreamEditorTable({tableData, projectKey, uniqWorkItemSelectors}) {
  const {columns, currentRecord, visible, onClose} = useValueStreamEditorColumns();

  const [status, updateStatus] = React.useReducer(
    (data, partialData) => ({
      ...data,
      ...partialData,
    }),
    {mode: "", message: ""}
  );

  // mutation to edit value stream
  const [mutate, {loading: mutationLoading, client}] = useEditValueStream({
    onCompleted: ({editValueStream}) => {
      if (editValueStream.success) {
        updateStatus({mode: "success", message: "Value stream was updated."});
        client.resetStore();
      } else {
        logGraphQlError("ValueStreamEditorTable.useEditValueStream", editValueStream.errorMessage);
        updateStatus({mode: "error", message: editValueStream.errorMessage});
      }
    },
    onError: (error) => {
      logGraphQlError("ValueStreamEditorTable.useEditValueStream", error);
      updateStatus({mode: "error", message: error.message});
    },
  });

  function handleSubmit(values) {
    const payload = {
      name: values.name,
      description: values.description,
      workItemSelectors: values.workItemSelectors,
    };
    // call mutation on save button click
    mutate({
      variables: {
        projectKey,
        valueStreamKey: currentRecord.key,
        ...payload,
      },
    });

    onClose();
  }

  return (
    <>
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
          afterClose={() => updateStatus({mode: "init"})}
        />
      )}
      {status.mode === "error" && (
        <Alert
          message={status.message}
          type="error"
          showIcon
          closable
          className="tw-ml-auto tw-mr-[90px] tw-w-[300px]"
          afterClose={() => updateStatus({mode: "init"})}
        />
      )}
      <StripeTable dataSource={tableData} columns={columns} />
      <ValueStreamForm
        key={currentRecord?.name}
        initialValues={{
          name: currentRecord?.name ?? "",
          description: currentRecord?.description ?? "",
          workItemSelectors: currentRecord?.workItemSelectors ?? [],
        }}
        onSubmit={handleSubmit}
        visible={visible}
        onClose={onClose}
        formType="EDIT_FORM"
        uniqWorkItemSelectors={uniqWorkItemSelectors}
      />
    </>
  );
}
