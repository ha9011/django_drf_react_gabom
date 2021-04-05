import React from "react";
import First from "components/accounts/first";
import { Route, Switch } from "react-router-dom";

import "./index.scss";
import Main from "components/main/main";
const index = () => {
  return (
    <>
      <div className="contain">
        <div></div>
        <Switch>
          <Route path="/index/main" component={Main} />
          <Route path="/index" component={First} />
        </Switch>
      </div>
    </>
  );
};

export default index;
