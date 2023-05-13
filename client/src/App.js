import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import About from "./pages/About";
import Shop from "./components/shop/Shop";
import Header from "./components/Header";
import Chatbot from "./components/chatbot/Chatbot";

export default class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div className="container">
            <Header />

            <Route exact path="/" component={Landing} />
            <Route exact path="/about" component={About} />
            <Route exact path="/shop" component={Shop} />

            <Chatbot />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
