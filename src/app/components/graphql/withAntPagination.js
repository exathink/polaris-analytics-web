import React from "react";

export const withAntPagination = (QueryWrappedPaginatedTable, pageSize = 5) => {
  return class PaginatedQuery extends React.Component {
    state = {
      endCursor: null
    }
    onNewPage = (pagination) => {
      if (pagination.current > 1) {
        const offset = (pagination.current - 1) * pagination.pageSize - 1;
        this.setState({
          endCursor: btoa(`arrayconnection:${offset}`)
        });
      } else {
        this.setState({
          endCursor: null
        })
      }
    };

    render() {
      return <QueryWrappedPaginatedTable pageSize={pageSize} currentCursor={this.state.endCursor}
                                         onNewPage={this.onNewPage}/>
    }

  };
}