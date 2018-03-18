import React from 'react';
import Highcharts from 'highcharts';
import {withHighcharts, HighchartsChart} from 'react-jsx-highcharts';
import Dimensions from 'react-dimensions';
import {cloneChildrenWithProps} from "../../helpers/reactHelpers";

// This component is a wrapper around the react-jsx-highcharts component
// that expects containerWidth and containerHeight props from the react-dimensions
// component and passes it on its child components in turn.

// Since containerWidth and containerHeight are now available to all children
// they can be directly used in any of the highCharts jsx components, but in order
// to avoid having to set these in every chart we write, we also have the
// Chart component wrapped in ./chart so that it automatically sets the height
// and width from the passed in containerHeight and containerWidth.

// Together these wrappers isolate the boilerplate needed to create
// resizable charts.

// Note this component *cannot* be implemented as pure stateless component
// because of the issues with the Dimensions HOC which does not work
// properly with them. This is why we have implemented it as a full fledged
// react component.

class HighchartsChartContainer extends React.Component {
  render() {
    const {containerWidth, containerHeight, children, ...rest} = this.props;
    return (
      <HighchartsChart {...rest}>
        {cloneChildrenWithProps(children, {containerWidth: containerWidth, containerHeight: containerHeight})}
      </HighchartsChart>
    )
  }
}
export default withHighcharts(Dimensions({elementResize: true})(HighchartsChartContainer), Highcharts);
