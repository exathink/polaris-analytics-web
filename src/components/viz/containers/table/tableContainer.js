import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import {cloneChildrenWithProps} from "../../../../helpers/reactHelpers";
import Dimensions from 'react-dimensions';

class TableContainer extends React.Component {
  render() {
    const {containerHeight, containerWidth, children, ...rest} = this.props;
    return (
      <ReactTable style={{height: containerHeight, width: containerWidth}} {...rest}>
        {cloneChildrenWithProps(children, {containerWidth: containerWidth, containerHeight: containerHeight, ...rest})}
      </ReactTable>
    );
  }
}
export default Dimensions({elementResize: true})(TableContainer);