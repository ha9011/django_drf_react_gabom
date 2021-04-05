import React from "react";
import { Button } from "reactstrap";
import "./friendSearchRow.scss";
import Axios from "axios";
import { useAppContext } from "store";
const FriendSearchRow = ({
  friendInfo,
  searchList,
  setSearchList,
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
  const applyFriend = () => {
    async function fn() {
      try {
        let response = await Axios.post(
          `http://localhost:8000/friend/apply/`,
          { friend: friendInfo.pk },
          config
        );
        console.log(response);
        // 친구찾기 리스트 중 신청한 친구 삭제
        setSearchList(searchList.filter((user) => user.pk !== friendInfo.pk));

        setApplyList(applyList.concat(response.data));
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
        <Button onClick={applyFriend} color="success">
          친구신청
        </Button>
      </div>
    </div>
  );
};

export default FriendSearchRow;
