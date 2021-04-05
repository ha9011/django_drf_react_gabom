import React from "react";
import MyFriendList from "./myFriendList";

const MyFriend = ({ myFriend, setMyFriend, setFriendInfo, toggle }) => {
  return (
    <div className="searchContain">
      <div className="searchTitle">
        <div className="title1">내 친구</div>
      </div>

      <div className="searchResultList">
        {myFriend.map((item, index) => (
          <MyFriendList
            key={item.pk}
            friendInfo={item}
            myFriend={myFriend}
            setMyFriend={setMyFriend}
            setFriendInfo={setFriendInfo}
            toggle={toggle}
          />
        ))}
      </div>
    </div>
  );
};

export default MyFriend;
