import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import ChatRoom from "./pages/ChatRoom";
import Home from "./pages/Home";

function Routes() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Home} />
      <Route path="/chat/:roomId" component={ChatRoom} />
    </BrowserRouter>
  );
}

export default Routes;
