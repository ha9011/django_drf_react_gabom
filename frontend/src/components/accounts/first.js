import React from "react";
import { Switch, Route } from "react-router-dom";
import Type from "components/accounts/type";
import Join from "components/accounts/join";
import firstBack from "public/video/background.mp4";
import "./first.scss";
import Login from "./login";
import Lost from "./lost";
import Check from "./check";

const First = ({ match }) => {
  return (
    <>
      <div className="mainTitle"> G A B O M </div>
      <div className="firstMain">
        <div className="gabomBackground">
          <video
            className="videoBack"
            src={firstBack}
            type="video/mp4"
            muted="muted"
            loop="loop"
            autoPlay
          />
        </div>
        <div className="inputArea">
          <Switch>
            <Route path="/index/type" component={Type} />
            <Route path="/index/join" component={Join} />
            <Route path="/index/lost" component={Lost} />
            <Route path="/index/check" component={Check} />
            <Route path="/index/" component={Login} />
          </Switch>
        </div>
      </div>
    </>
  );
};

export default First;
