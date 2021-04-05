import React from "react";
import { Button } from "reactstrap";
import Axios from "axios";
import { useAppContext } from "store";
const FriendToMeApplyList = ({
  friendInfo,
  appliedList,
  setAppliedList,
  myFriend,
  setmyFriend,
  setFriendInfo,
  toggle,
}) => {
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };
  const appliedRejectlFriend = () => {
    async function fn() {
      try {
        let response = await Axios.post(
          `http://localhost:8000/friend/appliedReject/`,
          { friend: friendInfo.pk },
          config
        );
        console.log(response);
        // applyList 필터 삭제
        setAppliedList(appliedList.filter((info) => info.pk !== friendInfo.pk));
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

  const appliedAgreelFriend = () => {
    async function fn() {
      try {
        let response = await Axios.post(
          `http://localhost:8000/friend/appliedAgree/`,
          { friend: friendInfo.pk },
          config
        );
        console.log(response);
        // applyList 필터 삭제
        setAppliedList(appliedList.filter((info) => info.pk !== friendInfo.pk));
        setmyFriend(myFriend.concat(response.data));
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
        <Button onClick={appliedAgreelFriend} color="success">
          승인
        </Button>
        <span> </span>
        <Button onClick={appliedRejectlFriend} color="success">
          거절
        </Button>
      </div>
    </div>
  );
};
export default FriendToMeApplyList;
