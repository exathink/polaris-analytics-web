import React, {Component} from 'react';
import {StickerWidgetWrapper} from './style';
import {Link} from 'react-router-dom';


export default class StickerWidget extends Component {
  render() {
    const {fontColor, bgColor, width, icon, number, hoverText, text, link} = this.props;

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
      <StickerWidgetWrapper className="isoStickerWidget" style={widgetStyle} title={hoverText}>
        <div className="isoIconWrapper">
          <i className={icon} style={iconStyle}/>
        </div>

        <div className="isoContentWrapper">
          {
            link ?
              <Link to={link}>
                <StickerBody {...{number, text, textColor}}/>
              </Link>
              : <StickerBody {...{number, text, textColor}}/>
          }
        </div>
      </StickerWidgetWrapper>
    );
  }
}

const StickerBody = ({number, numberHover, text, textColor}) => (
  <React.Fragment>
    <h3 className="isoStatNumber" style={textColor}>
      {number}
    </h3>
    <span className="isoLabel" style={textColor}>
        {text}
      </span>
  </React.Fragment>

)

export const StickerIcon = ({fontColor, bgColor, width, icon, number, hoverText, text, link}) => {

  const widgetStyle = {
    backgroundColor: bgColor,
    width: width,
  };
  const iconStyle = {
    color: fontColor,
  };
  return (
    <StickerWidgetWrapper className="isoStickerWidget" style={widgetStyle} title={hoverText}>
      <div className="isoIconWrapper">
        <i className={icon} style={iconStyle}/>
      </div>
    </StickerWidgetWrapper>
  )
}