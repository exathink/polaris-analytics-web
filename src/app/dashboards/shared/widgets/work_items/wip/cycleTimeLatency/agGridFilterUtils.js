import {Checkbox, Menu, Button} from "antd";
import React from "react";
import {getContainerNode} from "../../../../../../helpers/utility";

export default React.forwardRef((props, ref) => {
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
        className={""}
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
      <div className={`ant-table-filter-dropdown-btns`}>
        <Button
          type="link"
          size="small"
          disabled={selectedKeys.length === 0}
          onClick={() => {
            setSelectedKeys([]);
          }}
        >
          Reset
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setSelectedKeys(selectedKeys);
          }}
        >
          OK
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
      <Menu.Item key={filter.value !== undefined ? key : index}>
        <Component checked={filteredKeys.includes(key)} />
        <span className="tw-ml-2">{filter.text}</span>
      </Menu.Item>
    );
  });
}