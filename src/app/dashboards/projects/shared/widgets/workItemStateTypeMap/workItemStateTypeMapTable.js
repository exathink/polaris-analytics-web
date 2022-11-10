import {StripeTable} from "../../../../../components/tables/tableUtils";
import {WorkItemStateTypeColorClass, WorkItemStateTypeDisplayName} from "../../../../shared/config";

export function useWorkItemStateTypeMapColumns() {
  const columns = [
    {
      title: "Phase",
      dataIndex: "stateType",
      key: "stateType",
      width: "20%",
      render: (text, record) => <span className="tw-font-semibold">{WorkItemStateTypeDisplayName[text]}</span>,
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      width: "40%",
      render: (text, record) => text,
    },
    {
      title: "State Type",
      dataIndex: "test",
      key: "test",
      width: "40%",
      render: (text, record) => text,
    },
  ];
  return columns;
}

export function WorkItemStateTypeMapTable({tableData, columns, loading, testId}) {
  return (
    <StripeTable
      dataSource={tableData}
      columns={columns}
      loading={loading}
      testId={testId}
      rowKey={(record) => record.key}
      rowClassName={(record) => WorkItemStateTypeColorClass[record.stateType]}
    />
  );
}
