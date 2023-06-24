import {CaretDownOutlined, CaretUpOutlined, FilterFilled} from "@ant-design/icons";
import classNames from "classnames";
import React from "react";
import {Checkbox, Menu, Button} from "antd";
import {getContainerNode} from "../../../../../../helpers/utility";
import {LabelValue} from "../../../../../../helpers/components";

export function CustomHeader(props) {
  const [ascSort, setAscSort] = React.useState("inactive");
  const [descSort, setDescSort] = React.useState("inactive");
  const [noSort, setNoSort] = React.useState("inactive");
  const refButton = React.useRef(null);

  const onMenuClicked = (e) => {
    if (e.stopPropagation) e.stopPropagation();
    props.showColumnMenu(refButton.current);
  };

  const onSortChanged = () => {
    setAscSort(props.column.isSortAscending() ? "active" : "inactive");
    setDescSort(props.column.isSortDescending() ? "active" : "inactive");
    setNoSort(!props.column.isSortAscending() && !props.column.isSortDescending() ? "active" : "inactive");
  };

  const onSortRequested = (order, event) => {
    props.setSort(order, event.shiftKey);
  };

  React.useEffect(() => {
    props.column.addEventListener("sortChanged", onSortChanged);
    onSortChanged();
  }, []);

  let menu = null;

  if (props.enableMenu) {
    menu = (
      <div
        ref={refButton}
        className="customHeaderMenuButton tw-cursor-pointer tw-justify-self-end"
        onClick={(e) => onMenuClicked(e)}
      >
        <FilterFilled className="tw-p-1 !tw-text-[#bfbfbf] hover:!tw-bg-[rgba(0,0,0,.04)] hover:!tw-text-[rgba(0,0,0,.45)]" />
      </div>
    );
  }

  let sort = null;
  if (props.enableSorting) {
    sort = (
      <div className="tw-ml-auto tw-mr-1">
        <div className={`customSortLabel tw-flex tw-flex-col`}>
          <CaretUpOutlined
            className={classNames(
              ascSort,
              "tw-inline-block !tw-text-[11px] !tw-leading-[0.5rem] !tw-text-[#bfbfbf] hover:!tw-bg-[rgba(0,0,0,.04)] hover:!tw-text-[rgba(0,0,0,.45)]"
            )}
          />
          <CaretDownOutlined
            className={classNames(
              descSort,
              "tw-inline-block !tw-text-[11px] !tw-mt-[-3px] !tw-leading-[0.5rem] !tw-text-[#bfbfbf] hover:!tw-bg-[rgba(0,0,0,.04)] hover:!tw-text-[rgba(0,0,0,.45)]"
            )}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="headerOne tw-flex tw-w-full tw-cursor-pointer tw-items-center tw-justify-between"
      onClick={(event) => {
        if (noSort === "active") {
          onSortRequested("asc", event);
        } else {
          if (ascSort === "active") {
            onSortRequested("desc", event);
          } else {
            onSortRequested("", event);
          }
        }
      }}
      onTouchEnd={(event) => onSortRequested("asc", event)}
    >
      <div className="customHeaderLabel tw-uppercase tw-text-xs tw-font-medium">{props.displayName}</div>
      {sort}
      {menu}
    </div>
  );
}

export const MultiCheckboxFilter = React.forwardRef((props, ref) => {
  const [selectedKeys, setSelectedKeys] = React.useState([]);

  React.useImperativeHandle(ref, () => {
    return {
      doesFilterPass(params) {
        return selectedKeys.some(selectedKey => props.onFilter({value: selectedKey, record: params.data}));
      },

      isFilterActive() {
        return selectedKeys.length > 0;
      },

      getModel() {
        return undefined;
      },

      setModel(model) {},
    };
  });

  React.useEffect(() => {
    props.filterChangedCallback();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKeys]);

  const onSelectKeys = ({selectedKeys}) => {
    setSelectedKeys(selectedKeys);
  };
  return (
    <div className="ant-table-filter-dropdown">
      <Menu
        multiple={true}
        prefixCls={`ant-dropdown-menu`}
        className={"!tw-bg-[rgb(248,248,248)]"}
        onSelect={onSelectKeys}
        onDeselect={onSelectKeys}
        selectedKeys={selectedKeys}
        getPopupContainer={getContainerNode}
      >
        {renderFilterItems({
          filters: props.values || [],
          filteredKeys: selectedKeys,
        })}
      </Menu>
      <div className={`ant-table-filter-dropdown-btns tw-flex !tw-justify-end !tw-bg-[rgb(248,248,248)] !tw-border-t-[rgb(221,226,235)]`}>
        <Button
          type="default"
          onClick={() => {
            setSelectedKeys([]);
          }}
          className="ag-button ag-standard-button ag-filter-apply-panel-button tw-p-2"
        >
          Reset
        </Button>
      </div>
    </div>
  );
});

function renderFilterItems({filters, prefixCls, filteredKeys}) {
  return filters.map((filter, index) => {
    const key = String(filter.value);

    const Component = Checkbox;

    return (
      <Menu.Item key={filter.value !== undefined ? key : index} className="!tw-leading-3">
        <Component checked={filteredKeys.includes(key)} />
        <span className="tw-ml-2">{filter.text}</span>
      </Menu.Item>
    );
  });
}

export function getFilteredRowCountValue(gridApi) {
  let filteredRowCount = 0;
  gridApi.forEachNodeAfterFilter((node) => {
    if (!node.group) {
      filteredRowCount++;
    }
  });
  return filteredRowCount;
}

export function getTotalRowCount(gridApi) {
  let totalRowCount = 0;
  gridApi.forEachNode((node) => {
    if (!node.group) {
      totalRowCount++;
    }
  });
  return totalRowCount;
}

export const CustomTotalAndFilteredRowCount = (props) => {
  const [totalCount, setTotalCount] = React.useState(0);
  const [filteredCount, setFilteredCount] = React.useState(0);

  React.useEffect(() => {
    props.api.addEventListener("modelUpdated", updateCounts);
    updateCounts();

    return () => {
      props.api.removeEventListener("modelUpdated", updateCounts);
    };
  }, [props.api]);

  function updateCounts() {
    setTotalCount(getTotalRowCount(props.api));
    setFilteredCount(getFilteredRowCountValue(props.api));
  }

  let value;
  if (filteredCount === totalCount) {
    value = `${totalCount}`;
  } else {
    value = `${filteredCount} of ${totalCount}`;
  }

  return (
    <LabelValue
      label={props.label || "Rows"}
      value={value}
      className={"tw-py-2"}
    />
  );
};