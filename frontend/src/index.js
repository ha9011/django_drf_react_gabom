import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./index.css";
import Root from "pages"; // 폴더명을 썻을땐, index가 자동으러 불러짐
import "bootstrap/dist/css/bootstrap.min.css";
import { AppProvider } from "store.js";
ReactDOM.render(
  <BrowserRouter>
    <AppProvider>
      <Switch>
        <Route path="/index" component={Root} />
      </Switch>
    </AppProvider>
  </BrowserRouter>,

  document.getElementById("root")
);
