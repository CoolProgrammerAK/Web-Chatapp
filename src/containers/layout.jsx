import Header from "../components/Header";
import React from "react";
import { Switch, Route } from "react-router-dom";
import LiveVisitors from "../components/LiveVisitors";
import Roomchat from "../components/Roomchat";
import Publicchat from "../components/Publicchat";
import PublicchatContainer from "./publicchatcontainer";
function Layout() {
  return (
    <>
      <Header />

          <Switch>
            <Route path="/" exact component={Publicchat}></Route>
            
            <Route path="/roomChat" component={Roomchat} exact></Route>
            <Route path="/liveVisitors" component={LiveVisitors} exact></Route>
            <Route path="/:slug" exact component={PublicchatContainer}></Route>
          </Switch>
     
    </>
  );
}

export default Layout;
