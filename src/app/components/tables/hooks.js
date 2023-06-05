import React, {useState} from 'react';
import {Button, Checkbox, Empty, Input, Menu} from "antd";
import {Highlighter} from "../misc/highlighter";
import {CloseOutlined, SearchOutlined} from "@ant-design/icons";
import {getContainerNode} from "../../helpers/utility";

export function useSearch(dataIndex, {onSearch, customRender} = {}) {
  const [searchText, setSearchText] = useState(null);
  const searchInputElement = React.useRef();

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
    onSearch && onSearch(selectedKeys[0])
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    confirm();
    setSearchText('');
    onSearch && onSearch(null)
  };

  const getDescendantValues = (record) => {
    const values = [];
    (function recurse(record) {
      let recordVal = record[dataIndex]??"";
      values.push(recordVal.toString().toLowerCase());
      record.children && record.children.forEach(recurse);
    })(record);
    return values;
  }; 

  const searchProps = {
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => {
      searchProps.clearFilters = clearFilters;
      searchProps.confirm = confirm;
      return (
        <div style={{padding: 8}}>
          <Input
            ref={searchInputElement}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm)}
            style={{width: 188, marginBottom: 8, display: 'block'}}
          />
        </div>
      );
    },

    filterIcon: (filtered) => {
      if (filtered) {
        return <CloseOutlined onClick={() => handleReset(searchProps.clearFilters, searchProps.confirm)}/>;
      } else {
        return <SearchOutlined />;
      }
    },

    onFilter: (value, record) => {
      const recordName = record[dataIndex]??"";
      const searchLower = value.toLowerCase();
      return (
        recordName.toString().toLowerCase().includes(searchLower) ||
        getDescendantValues(record).some((descValue) => descValue.includes(searchLower))
      );
    },
    

    onFilterDropdownVisibleChange: visible => {
      if (visible) {     
        setTimeout(() => searchInputElement.current && searchInputElement.current.select(), 100);
      }
    },
    render: (text, record) => {
      if (customRender) {
        return customRender(text, record, searchText);
      }
      return (
        text && (
          <Highlighter
            highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
            searchWords={searchText || ""}
            textToHighlight={text.toString()}
          />
        )
      );

  },
  }
  return searchProps;
}

export function useSearchMultiCol(dataIndexes, {customRender} = {}) {
  const [searchText, setSearchText] = useState(null);
  const searchInputElement = React.useRef();

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    confirm();
    setSearchText("");
  };

  const getDescendantValues = (record, dataIndex) => {
    const values = [];
    (function recurse(record) {
      values.push((record[dataIndex] ?? "").toString().toLowerCase());
      record.children && record.children.forEach(recurse);
    })(record);
    return values;
  }; 

  const searchProps = {
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => {
      searchProps.clearFilters = clearFilters;
      searchProps.confirm = confirm;
      return (
        <div style={{padding: 8}}>
          <Input
            ref={searchInputElement}
            placeholder={`Search Card Details`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm)}
            style={{width: 188, marginBottom: 8, display: "block"}}
          />
        </div>
      );
    },

    filterIcon: (filtered) => {
      if (filtered) {
        return <CloseOutlined onClick={() => handleReset(searchProps.clearFilters, searchProps.confirm)} />;
      } else {
        return <SearchOutlined />;
      }
    },

    onFilter: (value, record) => {
      const searchLower = value.toLowerCase();
      return (
        dataIndexes.some((dataIndex) => (record[dataIndex] ?? "").toString().toLowerCase().includes(searchLower)) ||
        dataIndexes.some((dataIndex) =>
          getDescendantValues(record, dataIndex).some((descValue) => descValue.includes(searchLower))
        )
      );
    },

    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInputElement.current && searchInputElement.current.select(), 100);
      }
    },
    render: (text, record) => {
      if (customRender) {
        return customRender(text, record, searchText);
      }
      return null;
    },
  };
  return searchProps;
}

export function useSelectionHandler(onSelectionsChanged, initialSelections) {
  const [selected, setSelected] = useState(initialSelections || []);

  const onSelect = (record) => {
    const newSelections = [...selected, record];
    setSelected(newSelections);
    onSelectionsChanged && onSelectionsChanged(newSelections);
  }

  const onDeselect = (record) => {
    const newSelections = selected.filter(r => r.key !== record.key)
    setSelected(newSelections);
    onSelectionsChanged && onSelectionsChanged(newSelections);
  }


  return {
    selectedRowKeys: initialSelections ? initialSelections.map(row => row.key) : [],
    onSelect: (record, selected, selectedRow, _) => (
      selected ?
        onSelect(record)
        :
        onDeselect(record)
    ),
    onSelectAll: (selected, selectedRows, changeRows) => {
      setSelected(selectedRows);
      onSelectionsChanged && onSelectionsChanged(selectedRows)
    }
  }
}

export function useComboColFilter(dataIndex, {customRender}) {
  const [searchText] = useState(null);

  function filterDropdown({setSelectedKeys, selectedKeys, confirm, clearFilters, filters}) {
    const onSelectKeys = ({selectedKeys}) => {
      setSelectedKeys(selectedKeys);
    };

    const menuItems = filters.map((filter, index) => {
      const key = String(filter.value);
      const item = (
        <Menu.Item key={filter.value !== undefined ? key : index}>
          <Checkbox checked={selectedKeys.includes(key)} />
          <span>{filter.text}</span>
        </Menu.Item>
      );
      return item;
    });

    const getFilterComponent = () => {
      if ((filters || []).length === 0) {
        return (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={""}
            imageStyle={{
              height: 24,
            }}
            style={{
              margin: 0,
              padding: "16px 0",
            }}
          />
        );
      }
      return (
        <Menu
          multiple={true}
          prefixCls={`ant-dropdown-menu`}
          className="ant-dropdown-menu"
          onSelect={onSelectKeys}
          onDeselect={onSelectKeys}
          selectedKeys={selectedKeys}
          getPopupContainer={getContainerNode}
        >
          {menuItems}
        </Menu>
      );
    };

    const onConfirm = ()=>{
      confirm();
    }

    const dropdownContent = (
      <>
        {getFilterComponent()}
        <div className={`ant-table-filter-dropdown-btns`}>
          <Button type="link" size="small" disabled={selectedKeys.length === 0} onClick={clearFilters}>
            Reset
          </Button>
          <Button type="primary" size="small" onClick={onConfirm}>
            Ok
          </Button>
        </div>
      </>
    );

    return dropdownContent;
  }

  function onFilter(value, record) {
    const recordName = record.epicName??"";
    const searchLower = value.toLowerCase();
    return recordName.toString().toLowerCase().includes(searchLower)
  }

  function render(text, record) {
      if (customRender) {
        return customRender(text, record, searchText);
      }
      return (
        text && (
          <Highlighter
            highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
            searchWords={searchText || ""}
            textToHighlight={text.toString()}
          />
        )
      );
  }

  return {filterDropdown, render, onFilter};
}