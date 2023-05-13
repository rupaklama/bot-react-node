/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import QuickReply from "./QuickReply";

export default class QuickReplies extends Component {
  constructor(props) {
    super(props);

    this.onButtonClick = this.onButtonClick.bind(this);
  }

  onButtonClick(event, payload, text) {
    this.props.onButtonClick(event, payload, text);
    // console.log(event, payload, text);
  }

  render() {
    const { text, payload, speaks } = this.props;

    return (
      <div className="col s12 m8 offset-m2 l6 offset-l3">
        <div className="card-panel grey lighten-5 z-depth-1">
          <div className="row valign-wrapper">
            <div className="col s2">
              <a className="btn-floating btn-large waves-effect waves-light red">{speaks}</a>
            </div>
            <div id="quick-replies" className="col s10">
              {text && <p>{text.stringValue}</p>}

              {payload &&
                payload.map((reply, i) => <QuickReply key={i} reply={reply} onButtonClick={this.onButtonClick} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
