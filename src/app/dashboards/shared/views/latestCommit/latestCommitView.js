import React from 'react';
import StickerWidget from "../../containers/stickers/simpleSticker/sticker-widget";
import {fromNow} from "../../../../helpers/utility";
import {Statistic} from "antd";

export class LatestCommitView extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      text: fromNow(this.props.latestCommit)
    }
    this.timer=null;
  }

  resetText() {
    this.setState({
      text: fromNow(this.props.latestCommit)
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
              title="Latest Commit"
              value={this.state.text}
              precision={0}
              valueStyle={{ color: '#3f8600'}}

            />
            :
        <StickerWidget
              number={"Latest Commit"}
              text={this.state.text}
              icon="ion-clock"
              fontColor={this.props.fontColor}
              bgColor={this.props.bgColor}
        />
    );
  }

}