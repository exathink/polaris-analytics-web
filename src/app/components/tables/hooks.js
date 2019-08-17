import React, {useState} from 'react';

import {Table, Input, Button, Icon} from 'antd';
import {Highlighter} from "../misc/highlighter";

export function useSearch(dataIndex) {
  const [searchText, setSearchText] = useState(null);

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const searchProps = {
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
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
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{width: 90, marginRight: 8}}
        >
          Search
        </Button>
        <Button onClick={() => handleReset(clearFilters)} size="small" style={{width: 90}}>
          Reset
        </Button>
      </div>
    ),

    filterIcon: filtered => (
      <Icon type="search" style={{color: filtered ? '#1890ff' : undefined}}/>
    ),

    onFilter: (value, record) =>
      record[dataIndex] &&
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),

    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchProps.searchInput.select());
      }
    },
    render: text => (
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
  const [selected, setSelected] = useState(initialSelections);

  const onSelect = (record) => {
    const newSelections = [...selected, record];
    setSelected(newSelections);
    onSelectionsChanged(newSelections);
  }

  const onDeselect = (record) => {
    const newSelections = selected.filter(r => r.key !== record.key)
    setSelected(newSelections);
    onSelectionsChanged(newSelections);
  }


  return {
    selectedRowKeys: initialSelections.map(row => row.key),
    onSelect: (record, selected, selectedRow, _) => (
      selected ?
        onSelect(record)
        :
        onDeselect(record)
    ),
    onSelectAll: (selected, selectedRows, changeRows) => {
      setSelected(selectedRows);
      onSelectionsChanged(selectedRows)
    }
  }
}