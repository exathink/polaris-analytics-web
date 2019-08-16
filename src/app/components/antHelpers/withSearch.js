import React from 'react';
import {Input, Icon} from "antd";
import './withSearch.css';
import {Highlighter} from './searchHighlighter';

export const withSearch = (WrappedTableComponent) => {
    return class SearchQuery extends React.Component {
        constructor(props) {
            super(props);
            this.state = {searchText: '', selectedRecords: []};
        }

        getColumnSearchProps = dataIndex => ({
            filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => {
                this.clearFilters = clearFilters
                return (
                    <div style={{padding: 8}}>
                        <Input
                            ref={node => this.searchInput = node}
                            placeholder={`Search ${dataIndex}`}
                            value={selectedKeys[0]}
                            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                            onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                            style={{marginBottom: 8, display: 'block'}}
                        />
                    </div>
                )
            },
            filterIcon: filtered => (
                <Icon type={filtered ? "close" : "search"} style={{color: filtered ? '#1890ff' : undefined}} />
            ),
            onFilter: (value, record) =>
                record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: visible => {
                if (visible) {
                    if (this.searchInput.props.value) {
                        this.handleReset(this.clearFilters);
                    } else {
                        setTimeout(() => this.searchInput.select());
                    }
                }
            },
            render: text => (
                <Highlighter
                    highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                    searchWords={this.state.searchText}
                    textToHighlight={text.toString()}
                />
            ),
        });
        handleSearch = (selectedKeys, confirm) => {
            confirm();
            this.setState({searchText: selectedKeys[0]});
        };

        handleReset = clearFilters => {
            clearFilters();
            this.setState({searchText: ''});
        };

        handleRecordSelection = (affectedRecords, selected) => {
            const curSelectedList = this.state.selectedRecords;
            let newSelectedList = [];
            if (selected) {
                newSelectedList = [...curSelectedList, ...affectedRecords];
            } else {
                newSelectedList = curSelectedList.filter(curRecord => !affectedRecords.find(newRecord => curRecord.key === newRecord.key));
            }
            this.setState({selectedRecords: newSelectedList})
            this.props.onRecordsSelected(newSelectedList)
        }

        render() {
            return <WrappedTableComponent {...this.props} getColumnSearchProps={this.getColumnSearchProps} handleRecordSelection={this.handleRecordSelection} />
        }

    };
}