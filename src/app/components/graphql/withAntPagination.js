import React from "react";

export const withAntPagination = (QueryWrappedPaginatedTable, pageSize = 5) => {
  return class PaginatedQuery extends React.Component {
    state = {
      endCursor: null,
      reload: this.props.reload
    }
    onNewPage = (pagination) => {
      if (pagination.current > 1) {
        const offset = (pagination.current - 1) * pagination.pageSize - 1;
        this.setState({
          endCursor: btoa(`arrayconnection:${offset}`)
        });
      } else {
        this.setState({
          endCursor: null,
          reload: false
        })
      }
    };

    render() {
      const {reload, ...rest} = this.props;
      return <QueryWrappedPaginatedTable paging={true} pageSize={pageSize} currentCursor={this.state.endCursor}
                                         onNewPage={this.onNewPage} reload={this.state.reload} {...rest}/>
    }

  };
}