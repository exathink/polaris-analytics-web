import React from 'react';
import StickerWidget from "../../containers/stickers/simpleSticker/sticker-widget";
import {fromNow} from "../../../../helpers/utility";
import {Statistic} from "../../../../components/misc/statistic/statistic";
import fontStyles from "../../../../framework/styles/fonts.module.css";
export class HumanizedDateView extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      text: fromNow(this.props.dateValue)
    }
    this.timer=null;
  }

  resetText() {
    const display = fromNow(this.props.dateValue)
    if (this.state.text !== display) {
      this.setState({text: display})
    }

  }

  componentDidUpdate() {
    this.resetText()
  }

  componentDidMount() {
    this.timer = window.setInterval(this.resetText.bind(this), this.props.tick || 60*1000);
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
              prefix={<span className={fontStyles["text-base"]}>{this.state.text}</span>}
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