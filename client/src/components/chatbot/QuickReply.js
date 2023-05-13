/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { Component } from "react";

export default class QuickReply extends Component {
  onClick = event => {
    event.preventDefault();
    event.stopPropagation();

    this.props.onButtonClick(
      event,
      this.props.reply.structValue.fields.payload.stringValue,
      this.props.reply.structValue.fields.text.stringValue
    );
  };

  render() {
    if (this.props.reply.structValue.fields.payload) {
      return (
        <button
          style={{ margin: 3 }}
          className="btn-floating btn-large waves-effect waves-light green"
          onClick={this.onClick}
        >
          {this.props.reply.structValue.fields.text.stringValue}
        </button>
      );
      // External Link
    } else {
      return (
        <a
          style={{ margin: 3 }}
          href={this.props.reply.structValue.fields.link.stringValue}
          className="btn-floating btn-large waves-effect waves-light blue"
        >
          {this.props.reply.structValue.fields.text.stringValue}
        </a>
      );
    }
  }
}
