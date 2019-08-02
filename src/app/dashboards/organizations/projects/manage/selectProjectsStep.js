import React from 'react';

import {compose, Query} from "react-apollo";
import {work_tracking_service} from "../../../../services/graphql/index";
import gql from "graphql-tag";
import Button from "../../../../../components/uielements/button";
import {withMutation} from "../../../../components/graphql/withMutation";
import {Input, Table, Icon} from "antd";
import {NoData} from "../../../../components/misc/noData";

function getServerUrl(selectedConnector) {
  switch (selectedConnector.connectorType) {
    case 'pivotal':
      return 'Pivotal Tracker.com';
      break;
    case 'github':
      return 'GitHub.com';
      break;
    default:
      return selectedConnector.baseUrl;
  }
}


const REFETCH_PROJECTS_MUTATION = {
  name: 'refetchProjects',
  mutation: gql`
      mutation refreshConnectorProjects($connectorKey: String!) {
          refreshConnectorProjects(refreshConnectorProjectsInput:{
              connectorKey: $connectorKey
              track: true
          }){
              success
              trackingReceiptKey
          }
      }
  `,
  client: work_tracking_service,
  getTrackingReceipt: (result) => result.data ? result.data.refreshConnectorProjects.trackingReceiptKey : null
}

export const CONNECTOR_WORK_ITEMS_SOURCES_QUERY = gql`
    query getConnectorWorkItemsSources($connectorKey: String!) {
        workTrackingConnector(key: $connectorKey) {
            id
            name
            key
            connectorType
            state
            workItemsSources(unattachedOnly: true) {
                count
                edges {
                    node {
                        id
                        name
                        key
                        description
                        importState
                    }
                }
            }
        }
    }
`

export const REFETCH_CONNECTOR_WORK_ITEMS_SOURCES_QUERY = {
  query: CONNECTOR_WORK_ITEMS_SOURCES_QUERY,
  mapPropsToVariables: props => ({
    connectorKey: props.selectedConnector.key
  })
};


/*
  In the search example used in Antd they include a component called Highlighter

  import Highlighter from 'react-highlight-words';

  In order not to polute the package.json I created this component to produce the same effect

*/
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

export const SelectProjectsStep =
  compose(
    withMutation(REFETCH_PROJECTS_MUTATION, [REFETCH_CONNECTOR_WORK_ITEMS_SOURCES_QUERY])
  )(
    class _SelectProjectsStep extends React.Component {
      state = {searchText: ''};

      getColumnSearchProps = dataIndex => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
          <div style={{padding: 8}}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
              style={{width: 188, marginBottom: 8, display: 'block'}}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm)}
              icon="search"
              size="small"
              style={{width: 90, marginRight: 8}}
            >
              Search
        </Button>
            <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{width: 90}}>
              Reset
        </Button>
          </div>
        ),
        filterIcon: filtered => (
          <Icon type="search" style={{color: filtered ? '#1890ff' : undefined}} />
        ),
        onFilter: (value, record) =>
          record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
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
        const {selectedConnector, selectedProjects, onProjectsSelected, trackingReceiptCompleted} = this.props;
        const {refetchProjects, refetchProjectsResult} = this.props.refetchProjectsMutation;
        const columns = [
          {
            title: 'Remote Project Name',
            dataIndex: 'name',
            key: 'name',
            ...this.getColumnSearchProps('name'),
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
          }
        ]

        return (
          <Query
            client={work_tracking_service}
            query={CONNECTOR_WORK_ITEMS_SOURCES_QUERY}
            variables={{
              connectorKey: selectedConnector.key
            }}
          >
            {
              ({loading, error, data}) => {
                if (error) return null;
                let workItemsSources = []
                if (!loading) {
                  workItemsSources = data.workTrackingConnector.workItemsSources.edges.map(edge => edge.node);
                }
                return (
                  <div className={'select-projects'}>
                    <h3>Server: {getServerUrl(selectedConnector)}</h3>
                    <Button
                      type={'primary'}
                      icon={'download'}
                      onClick={
                        () => refetchProjects({
                          variables: {
                            connectorKey: selectedConnector.key
                          }
                        })}
                      loading={refetchProjectsResult.data && !trackingReceiptCompleted}
                    >
                      Fetch Projects
                    </Button>
                    {
                      workItemsSources.length > 0 ?
                        <React.Fragment>

                          <Table
                            dataSource={workItemsSources}
                            columns={columns}
                            loading={loading}
                            rowKey={record => record.key}
                            rowSelection={{
                              selectedRowKeys: selectedProjects.map(project => project.key),
                              onChange: (selectedKeys, selectedRows) => onProjectsSelected(selectedRows),
                            }}
                            pagination={{
                              total: workItemsSources.length,
                              showTotal: total => `${total} Projects`,
                              defaultPageSize: 5,
                              hideOnSinglePage: true
                            }}
                          >
                          </Table>
                        </React.Fragment>
                        :
                        <NoData message={"No projects imported"} />
                    }
                  </div>

                )
              }
            }
          </Query>

        )
      }
    }
  )




