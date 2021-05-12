import React, {useState} from 'react';
import { Input } from 'antd';
import {Highlighter} from "../misc/highlighter";
import {CloseOutlined, SearchOutlined} from "@ant-design/icons";
import {url_for_instance} from "../../framework/navigation/context/helpers";
import {Link} from "react-router-dom";
import WorkItems from "../../dashboards/work_items/context";
export function useSearch(dataIndex, {onSearch, isWorkItemLink} = {}) {
  const [searchText, setSearchText] = useState(null);
  const searchInputElement = React.useRef();

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
    onSearch && onSearch(selectedKeys[0])
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
    onSearch && onSearch(null)
  };

  const getDescendantValues = (record) => {
    const values = [];
    (function recurse(record) {
      values.push(record[dataIndex].toString().toLowerCase());
      record.children && record.children.forEach(recurse);
    })(record);
    return values;
  }; 

  const searchProps = {
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => {
      searchProps.clearFilters = clearFilters;
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
        return <CloseOutlined onClick={() => handleReset(searchProps.clearFilters)}/>;
      } else {
        return <SearchOutlined />;
      }
    },

    onFilter: (value, record) => {
      const recordName = record[dataIndex];
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
      if (isWorkItemLink) {
        return (
          text && (
            <Link to={`${url_for_instance(WorkItems, record.name, record.workItemKey)}`}>
              <Highlighter
                highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
                searchWords={searchText || ""}
                textToHighlight={text.toString()}
              />
            </Link>
          )
        );
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