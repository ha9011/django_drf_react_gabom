import React from "react";
import { Button, Nav, NavItem, NavLink, Badge } from "reactstrap";
import HouseBook from "../history/houseBook";
import SharePlan from "../history/sharePlan";
import "./travelMyHistory.scss";
const TravelMyHistory = () => {
  return (
    <div className="myHistoryMain">
      <SharePlan />
      <HouseBook />
    </div>
  );
};

export default TravelMyHistory;
