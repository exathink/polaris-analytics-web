import React, { Component } from 'react';
import { StickerWidgetWrapper } from './style';

export class VizStickerWidget extends Component {
  render() {
    const { fontColor, bgColor, width, icon} = this.props;

    const textColor = {
      color: fontColor,
    };
    const widgetStyle = {
      backgroundColor: bgColor,
      width: width,
    };
    const iconStyle = {
      color: fontColor,
    };

    return (
      <StickerWidgetWrapper className="isoStickerWidget" style={widgetStyle}>
          <div className="isoIconWrapper">
            <i className={icon} style={iconStyle} />
          </div>

          <div className="isoContentWrapper">
            {this.props.children}
          </div>
      </StickerWidgetWrapper>
    );
  }
}
