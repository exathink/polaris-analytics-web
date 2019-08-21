import React, {useState} from 'react';

import {Input, Icon} from 'antd';
import {Highlighter} from "../misc/highlighter";

export function useSearch(dataIndex, onSearch=null) {
  const [searchText, setSearchText] = useState(null);

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

  const searchProps = {
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => {
      searchProps.clearFilters = clearFilters;
      return (
        <div style={{padding: 8}}>
          <Input
            ref={node => {
              searchProps.searchInput = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm)}
            style={{width: 188, marginBottom: 8, display: 'block'}}
          />
        </div>
      );
    },

    filterIcon: filtered => (
      <Icon type={filtered ? "close" : "search"} style={{color: filtered ? '#1890ff' : undefined}}/>
    ),

    onFilter: (value, record) =>
      record[dataIndex] &&
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),

    onFilterDropdownVisibleChange: visible => {
      if (searchText) {
        handleReset(searchProps.clearFilters);
      } else {
        setTimeout(() => searchProps.searchInput && searchProps.searchInput.select());
      }
    },
    render: text => (
      text &&
      <Highlighter
        highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
        searchWords={searchText || ''}
        textToHighlight={text.toString()}
      />

    ),
  }
  return searchProps
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