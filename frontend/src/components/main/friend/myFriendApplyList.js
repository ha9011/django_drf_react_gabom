import React from "react";
import { Button } from "reactstrap";
import "./myFriendApplyList.scss";
import Axios from "axios";
import { useAppContext } from "store";
const MyFriendApplyList = ({
  friendInfo,
  applyList,
  setApplyList,
  setFriendInfo,
  toggle,
}) => {
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };
  const applyCancelFriend = () => {
    async function fn() {
      try {
        let response = await Axios.post(
          `http://localhost:8000/friend/applyCancel/`,
          { friend: friendInfo.pk },
          config
        );
        console.log(response);
        // applyList 필터 삭제
        setApplyList(applyList.filter((info) => info.pk !== friendInfo.pk));
      } catch (error) {
        alert("친구 검색 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
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
        <Button onClick={applyCancelFriend} color="success">
          요청취소
        </Button>
      </div>
    </div>
  );
};

export default MyFriendApplyList;
