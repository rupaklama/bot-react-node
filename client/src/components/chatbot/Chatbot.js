import React, { Component } from "react";

import axios from "axios";
import Cookies from "universal-cookie";
import { v4 as uuid } from "uuid";

import Message from "./Message";
import Card from "./Card";
import QuickReplies from "./QuickReplies";

const cookies = new Cookies();

export default class Chatbot extends Component {
  refDivEl;
  refInputEl;

  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      isBotOpen: true,
    };

    // user cookie to identify user
    if (cookies.get("userID") === undefined) {
      cookies.set("userID", uuid(), { path: "/" });
    }
    // console.log(cookies.get("userID"));

    this.onKeyPressInput = this.onKeyPressInput.bind(this);
  }

  componentDidMount() {
    // calling welcome intent
    this.dfEventQuery("welcome");
  }

  componentDidUpdate(prevProps, prevState) {
    // note - do this after component gets updated every time
    this.refDivEl.scrollIntoView({ behavior: "smooth" });
    this.refInputEl.focus();
  }

  toggleBotWindow() {
    this.setState({ isBotOpen: !this.state.isBotOpen });
  }

  // user text query
  async dfTextQuery(text) {
    try {
      let queryMsg = {
        speaks: "user",

        msg: {
          // setting up similar response structure from df here
          text: {
            text: text,
          },
        },
      };

      // adding user query msg into msg state
      this.setState({ messages: [...this.state.messages, queryMsg] });

      const response = await axios.post("/api/df-text-query", {
        text,
        userID: cookies.get("userID"),
      });

      for (let msg of response.data.fulfillmentMessages) {
        // console.log(JSON.stringify(msg));

        queryMsg = {
          speaks: "bot",

          msg: msg,
        };

        // adding bot query msg into msg state
        this.setState({ messages: [...this.state.messages, queryMsg] });
      }
    } catch (error) {
      console.log(error);
    }
  }

  // event query to call df intents
  // Custom events: These are events that you define to trigger df intents
  async dfEventQuery(event) {
    try {
      const response = await axios.post("/api/df-event-query", {
        event,
        userID: cookies.get("userID"),
      });

      for (let msg of response.data.fulfillmentMessages) {
        let queryMsg = {
          speaks: "bot",

          msg: msg,
        };

        // adding user query msg into msg state
        this.setState({ messages: [...this.state.messages, queryMsg] });
      }
    } catch (error) {
      console.log(error);
    }
  }

  renderMessages(msg) {
    if (msg) {
      return msg.map((item, i) => {
        // console.log("ITEM", item);

        if (item.msg && item.msg.text && item.msg.text.text[0]) {
          return <Message speaks={item.speaks} text={item.msg.text.text} key={i} />;
        }

        if (item.msg && item.msg.payload && item.msg.payload.fields && item.msg.payload.fields.cards) {
          return (
            <div key={i}>
              <div className="card-panel grey lighter-5 z-depth-1">
                <div>
                  <div className="col s2">
                    <a href="/" className="btn-floating btn-large waves-effect waves-light red">
                      {item.speaks}
                    </a>
                  </div>

                  <div style={{ overflow: "auto" }}>
                    <div
                      style={{
                        height: "300px",

                        width: item.msg.payload.fields.cards.listValue.values.length * 270,
                      }}
                    >
                      {item.msg.payload.fields.cards.listValue.values.map((item, i) => (
                        <Card key={i} payload={item} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (item.msg && item.msg.payload) {
          return (
            <QuickReplies
              text={item.msg.payload.fields.text ? item.msg.payload.fields.text : null}
              key={i}
              onButtonClick={(event, payload, text) => {
                console.log(event, payload, text);

                switch (this.payload) {
                  // "payload": "training masterclass", call 'masterclass' intent on this payload
                  case "training_masterclass":
                    this?.dfEventQuery("MASTERCLASS");
                    break;
                  default:
                    this?.dfTextQuery(text);
                    break;
                }
              }}
              speaks={item.speaks}
              payload={item.msg.payload.fields.quick_replies.listValue.values}
            />
          );
        }
      });
    }
  }

  onKeyPressInput(e) {
    // Call a function when the user presses a key - 'Enter'
    if (e.key === "Enter") {
      this.dfTextQuery(e.target.value);

      e.target.value = "";
    }
  }

  render() {
    const { messages, queryText, isBotOpen } = this.state;
    const { renderMessages, onKeyPressInput } = this;

    console.log(messages);
    console.log(queryText);

    // console.log(this.refEl);

    return (
      <>
        <div
          id="chatbot"
          style={{
            maxHeight: 500,
            maxWidth: 400,
            margin: "0 auto 1rem",
            position: "absolute",
            right: "20px",
            bottom: "0",
            overflow: "auto",
            border: "1px dotted lightgrey",
            padding: "1rem",
          }}
        >
          {renderMessages(messages)}

          <input
            type="text"
            placeholder="Enter text here..."
            onKeyPress={onKeyPressInput}
            ref={el => (this.refInputEl = el)}
          />

          <div ref={el => (this.refDivEl = el)} style={{ float: "left", clear: "both" }} />
        </div>
      </>
    );
  }
}
