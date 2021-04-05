import React from "react";
import { Button } from "reactstrap";
import Axios from "axios";
import { useAppContext } from "store";
const MyFriendList = ({
  friendInfo,
  myFriend,
  setMyFriend,
  setFriendInfo,
  toggle,
}) => {
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };
  const friendDelete = () => {
    async function fn() {
      try {
        let response = await Axios.post(
          `http://localhost:8000/friend/delete/`,
          { friend: friendInfo.pk },
          config
        );
        console.log(response);
        // applyList 필터 삭제
        setMyFriend(myFriend.filter((info) => info.pk !== friendInfo.pk));
      } catch (error) {
        alert("친구 검색 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }
    let check = window.confirm(
      `'${friendInfo.name}'님을 정말로 친구에서 삭제 하시겠습니까?`
    );

    check && fn();
    //fn();
  };

  const showFriendInfo = () => {
    setFriendInfo(friendInfo);
    toggle();
  };

  return (
    <div className="searchResultRow">
      <div className="searchResultRowImg">
        <img
          className="searchResultImg"
          width="50px"
          height="50px"
          src={`http://localhost:8000${friendInfo.profile.avatar}`}
          alt="프로필"
        />
      </div>
      <div className="searchResultRowName" onClick={showFriendInfo}>
        {friendInfo.name}
      </div>
      <div className="searchResultRowBtn">
        <Button onClick={friendDelete} color="success">
          삭제
        </Button>
      </div>
    </div>
  );
};

export default MyFriendList;
