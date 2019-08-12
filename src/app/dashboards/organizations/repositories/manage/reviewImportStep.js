import React from "react";
import {CompactTable} from "../../../../../components/uielements/table";

import Button from "../../../../../components/uielements/button";

export class ReviewImportStep extends React.Component {

  render() {
    const {selectedRepositories, onDoImport} = this.props;
    return (
      <div className={'selected-repositories'}>
        <h3>{selectedRepositories.length} {selectedRepositories.length > 1 ? 'repositories' : 'repository'} selected for import</h3>
        <CompactTable
          size="small"
          dataSource={selectedRepositories}
          rowKey={record => record.key}
          pagination={{
            total: selectedRepositories.length,
            showTotal: total => `${total} Repositories`,
            defaultPageSize: 5,
            hideOnSinglePage: true
          }}
        >
          <CompactTable.Column title={"Repository Name"} width='30%' dataIndex={"name"} key={"name"} />
          <CompactTable.Column title={"Description"} dataIndex={"description"} key={"description"} />
        </CompactTable>
        <Button
          type={'primary'}
          onClick={() => onDoImport()}
          disabled={selectedRepositories.length === 0}
        >Import {selectedRepositories.length > 1 ? 'Repositories' : 'Repository'}</Button>
      </div>
    )
  }
}
