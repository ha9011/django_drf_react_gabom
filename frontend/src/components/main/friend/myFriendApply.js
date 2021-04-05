import React from "react";
import { Button } from "reactstrap";
import MyFriendApplyList from "./myFriendApplyList";

const MyFriendApply = ({ applyList, setApplyList, setFriendInfo, toggle }) => {
  return (
    <div className="searchContain">
      <div className="searchTitle">
        <div className="title1">내가 요청한 친구 목록</div>
      </div>

      <div className="searchResultList">
        {applyList.map((item, index) => (
          <MyFriendApplyList
            key={item.pk}
            friendInfo={item}
            applyList={applyList}
            setApplyList={setApplyList}
            setFriendInfo={setFriendInfo}
            toggle={toggle}
          />
        ))}
      </div>
    </div>
  );
};

export default MyFriendApply;
