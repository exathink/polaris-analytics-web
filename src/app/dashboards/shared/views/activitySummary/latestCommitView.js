import React from 'react';
import StickerWidget from "../../containers/stickers/simpleSticker/sticker-widget";
import {fromNow} from "../../../../helpers/utility";
import {VizItem} from "../../containers/layout";

export class LatestCommitView extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      text: fromNow(this.props.latestCommit)
    }
  }

  resetText() {
    this.setState({
      text: fromNow(this.props.latestCommit)
    })
  }

  componentDidMount() {
    window.setTimeout(() => this.resetText(), 60*1000);
  }

  componentDidUpdate() {
    window.setTimeout(() => this.resetText(), 60*1000);
  }



  render() {
    return (
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