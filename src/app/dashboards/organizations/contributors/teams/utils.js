export const ACTIVE_WITHIN_DAYS = 30;

export function getRowSelection(data, [selectedRecords, setSelectedRecords], options = {}) {
  return {
    hideSelectAll: true,
    selectedRowKeys: selectedRecords.map((s) => s.key),
    onSelect: (_record, _selected, selectedRows) => {
      setSelectedRecords(selectedRows.map((x) => data.get(x.key)));
    },
    ...options,
  };
}