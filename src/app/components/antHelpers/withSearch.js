import React from 'react';
import {Input, Icon} from "antd";
import './withSearch.css';

const Highlighter = ({highlightStyle, searchWords, textToHighlight}) => {
    const splitText = textToHighlight.toLowerCase().split(searchWords.toLowerCase())
    const foundText = textToHighlight.substr(textToHighlight.toLowerCase().indexOf(searchWords.toLowerCase()), searchWords.length)
    return (
        searchWords.length && splitText.length > 1
            ?
            <React.Fragment>
                <span>{splitText[0]}</span>
                <span style={highlightStyle}>{foundText}</span>
                <span>{splitText[1]}</span>
            </React.Fragment>
            : <span>{textToHighlight}</span>
    )
}

export const withSearch = () => {
    return (WrappedTableComponent) => {
        return class SearchQuery extends React.Component {
            constructor(props) {
                super(props);
                this.state = {searchText: ''};
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

            render() {
                return <WrappedTableComponent {...this.props} getColumnSearchProps={this.getColumnSearchProps} />
            }

        };
    }
}