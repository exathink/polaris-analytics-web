import React from 'react';
import {Input, Icon} from "antd";
import {SearchHighlighter} from './searcHighlighter';
import './withSearch.css';

export const withSearch = (columns) => {
    return (Component) => {
        return class extends React.Component {
            constructor(props) {
                super(props);
                const tableColumns = columns.map(column => {
                    column.key = column.name;
                    column.dataIndex = column.name;
                    column.width = column.width || `${100 / columns.length}%`;
                    if (column.isSortField) { // Field will be sortable
                        column.sorter = (a, b) => a[column.dataIndex].localeCompare(b[column.dataIndex]);
                        column.sortDirections = ['ascend'];
                    }
                    if (column.isSearchField) { // Field will be searchable
                        column = {...column, ...this.getColumnSearchProps(column.dataIndex)};
                    }
                    return column;
                })
                this.state = {searchText: ''};
                this.tableColumns = tableColumns;
            }

            getColumnSearchProps = dataIndex => ({
                filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => {
                    this.clearFilters = clearFilters;
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
                    <SearchHighlighter
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

            render() {
                return <Component {...this.props} columns={this.tableColumns} />
            }
        };
    }
}