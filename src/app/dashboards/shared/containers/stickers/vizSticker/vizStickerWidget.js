import React, { Component } from 'react';
import { StickerWidgetWrapper } from './style';

export class VizStickerWidget extends Component {
  render() {
    const { fontColor, bgColor, width, icon, showHeader} = this.props;

    const textColor = {
      color: fontColor,
    };
    const widgetStyle = {
      backgroundColor: bgColor,
    };
    const headerStyle = {
      width: width
    };

    const iconStyle = {
      color: fontColor,
    };

    return (
      <StickerWidgetWrapper className="isoStickerWidget" style={widgetStyle}>
          {
            icon ?
              <div className="isoIconWrapper">
                <i className={icon} style={iconStyle}/>
              </div>
              : null
          }
          <div className="isoContentWrapper">
            {
              showHeader ?
                <div className={"stickerHeader"} style={headerStyle}>
                  {
                    this.props.number ?
                      <h3 className="isoStatNumber" style={textColor}>
                        {this.props.number}
                      </h3>
                      : null
                  }
                  {
                    this.props.text ?
                      <span className="isoLabel" style={textColor}>
                    {this.props.text}
                    </span>
                      : null
                  }
                </div>
                : null
              }
            {this.props.children}
          </div>
      </StickerWidgetWrapper>
    );
  }
}
