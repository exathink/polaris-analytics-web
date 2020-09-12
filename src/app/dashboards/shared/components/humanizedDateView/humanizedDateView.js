import React from 'react';
import StickerWidget from "../../containers/stickers/simpleSticker/sticker-widget";
import {fromNow} from "../../../../helpers/utility";
import {Statistic} from "../../../../components/misc/statistic/statistic";

export class HumanizedDateView extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      text: fromNow(this.props.dateValue)
    }
    this.timer=null;
  }

  resetText() {
    this.setState({
      text: fromNow(this.props.dateValue)
    })
  }

  componentDidMount() {
    this.timer = window.setInterval(this.resetText.bind(this), 60*1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.timer);
    this.timer = null;
  }



  render() {
    return (
      this.props.asStatistic ?
        <Statistic
              title={this.props.title}
              value={' '}
              prefix={this.state.text}
              precision={0}
              valueStyle={{ color: '#3f8600'}}

            />
            :
        <StickerWidget
              number={this.props.title}
              text={this.state.text}
              icon="ion-clock"
              fontColor={this.props.fontColor}
              bgColor={this.props.bgColor}
        />
    );
  }

}