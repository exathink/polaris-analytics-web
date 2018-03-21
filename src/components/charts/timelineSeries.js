import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Series} from 'react-jsx-highcharts';
import Highcharts from "highcharts";

require('highcharts/modules/xrange.js')(Highcharts);

export class TimelineSeries extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };

  render () {
    return (
      <Series {...this.props} type="xrange" />
    );
  }
}

