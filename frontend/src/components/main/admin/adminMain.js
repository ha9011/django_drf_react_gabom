import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import AdminManage from "./adminManage";

const AdminMain = () => {
  let history = useHistory();

  return (
    <>
      <div className="houseNav">
        <div className="houseMenu">관리</div>
      </div>

      <div>
        <Route exact path="/index/main/admin/manage" component={AdminManage} />
      </div>
    </>
  );
};

export default AdminMain;
