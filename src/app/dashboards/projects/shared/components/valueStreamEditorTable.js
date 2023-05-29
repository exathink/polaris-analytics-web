import React from "react";
import {ValueStreamForm} from "./projectValueStreamUtils";
import Button from "../../../../../components/uielements/button";
import {StripeTable} from "../../../../components/tables/tableUtils";
import {CustomTag} from "../../../../helpers/components";

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
            </Button>{" "}
            <Button type="danger" size="small">
              Delete
            </Button>
          </div>
        );
      },
    },
  ];
  return {columns, currentRecord, visible, onClose};
}

export function ValueStreamEditorTable({tableData}) {
  const {columns, currentRecord, visible, onClose} = useValueStreamEditorColumns();

  return (
    <>
      <StripeTable dataSource={tableData} columns={columns} />
      <ValueStreamForm
        key={currentRecord?.name}
        initialValues={{name: currentRecord?.name ?? "", workItemSelectors: currentRecord?.workItemSelectors ?? []}}
        visible={visible}
        onClose={onClose}
        formType="EDIT_FORM"
      />
    </>
  );
}
