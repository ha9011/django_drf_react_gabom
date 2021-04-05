import React from "react";
import { Button } from "reactstrap";
import FriendToMeApplyList from "./friendToMeApplyList";

const FriendToMeApply = ({
  appliedList,
  setAppliedList,
  myFriend,
  setmyFriend,
  setFriendInfo,
  toggle,
}) => {
  return (
    <div className="searchContain">
      <div className="searchTitle">
        <div className="title1">나를 요청한 친구 목록</div>
      </div>

      <div className="searchResultList">
        {appliedList.map((item, index) => (
          <FriendToMeApplyList
            key={item.pk}
            friendInfo={item}
            appliedList={appliedList}
            setAppliedList={setAppliedList}
            myFriend={myFriend}
            setmyFriend={setmyFriend}
            setFriendInfo={setFriendInfo}
            toggle={toggle}
          />
        ))}
      </div>
    </div>
  );
};
export default FriendToMeApply;
