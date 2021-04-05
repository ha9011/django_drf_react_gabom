import React, { useState } from "react";
import "./travelManage.scss";
import { Route, Link } from "react-router-dom";
import TravelMenuList from "./travelMenuList";

import TravelProfileCard from "./travelProfileCard";
import TravelMainContent from "./travelMainContent";
import TravelMyPlan from "./travelMyPlan";
import TravelMyFriend from "../friend/travelMyFriend";
import TravelMyHistory from "./travelMyHistory";
import backswing from "public/video/bg_swing.mp4";

const TravelManage = () => {
  const [useMenu, setUseMenu] = useState(0);
  return (
    <>
      <div className="travelManageMain">
        <div className="travelManageMenu">
          <TravelProfileCard />
          <br />
          <br />
          <TravelMenuList setMenu={setUseMenu} />
        </div>
        <div className="travelManageContent">
          <div className="backSwingDiv">
            <video
              className="backSwing"
              src={backswing}
              type="video/mp4"
              muted="muted"
              loop="loop"
              autoPlay
            />
          </div>
          {useMenu === 0 && <TravelMainContent />}
          {useMenu === 1 && <TravelMyPlan />}
          {useMenu === 2 && <TravelMyFriend />}
          {useMenu === 3 && <TravelMyHistory />}
        </div>
      </div>
    </>
  );
};

export default TravelManage;
