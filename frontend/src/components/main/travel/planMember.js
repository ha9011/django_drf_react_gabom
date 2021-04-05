import React from "react";

import { Button, Badge } from "reactstrap";
import Axios from "axios";
import { useAppContext } from "store";
import "./planMember.scss";
const PlanMember = ({ id, basicInfo }) => {
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };
  console.log("====");
  console.log(basicInfo);

  return (
    <div className="memberDiv">
      <div className="memberDivImg">
        <img
          className="memberImg"
          width="50px"
          height="50px"
          src={`http://localhost:8000${basicInfo.user.profile.avatar}`}
          alt="프로필"
        />
      </div>
      <div className="memberDivName">{basicInfo.user.name}</div>
      <div className="memberDivIntro">{basicInfo.user.profile.introduce}</div>
    </div>
  );
};

export default PlanMember;
