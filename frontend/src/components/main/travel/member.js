import React from "react";

import { Button, Badge } from "reactstrap";
import Axios from "axios";
import { useAppContext } from "store";
import "./member.scss";
const Member = ({
  index,
  memberInfo,
  state,
  setMember,
  memberList,
  planNo,
  setNoMember,
  noMemberList,
}) => {
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  console.log("==Member==");
  console.log(memberInfo);
  console.log(state);
  console.log(store);
  console.log(planNo);
  console.log(memberList);

  const memberKickOut = () => {
    async function fn() {
      try {
        let response = await Axios.post(
          `http://localhost:8000/plans/kickOuts/${planNo}/${memberInfo.pk}`,
          { memberId: memberInfo.pk, planNo: planNo },
          config
        );

        console.log("==memberKickOut==");
        console.log(response.data);
        // applyList 필터 삭제
        setMember(memberList.filter((info) => info.user.pk !== memberInfo.pk));
        // 노 맴버 친구에 추가
        setNoMember(noMemberList.concat(response.data));
      } catch (error) {
        alert("맴버삭제 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  };

  return (
    <div className="memberRow">
      <div className="memberImg">
        <img
          className="searchResultImg"
          width="30px"
          height="30px"
          src={`http://localhost:8000${memberInfo.profile.avatar}`}
          alt="프로필"
        />
      </div>

      {state === "1" &&
      store.userName !== memberInfo.name &&
      memberList[index]["complete"] === "1" ? (
        <>
          <div className="memberName">{memberInfo.name}</div>
          <div className="memberBtnDiv">
            <Button
              className="memberBtn"
              onClick={memberKickOut}
              color="success"
              size="sm"
            >
              강퇴
            </Button>
          </div>
        </>
      ) : state === "1" &&
        store.userName !== memberInfo.name &&
        memberList[index]["complete"] === "0" ? (
        <>
          <div className="memberName">
            {memberInfo.name}
            <span> </span>
            <Badge href="#" color="success">
              대기중..
            </Badge>
          </div>
          <div className="memberBtnDiv">
            <Button
              className="memberBtn"
              onClick={memberKickOut}
              color="success"
              size="sm"
            >
              취소
            </Button>
          </div>
        </>
      ) : state === "0" &&
        store.userName !== memberInfo.name &&
        memberList[index]["complete"] === "0" ? (
        <>
          <div className="memberName">
            {memberInfo.name}
            <span> </span>
            <Badge href="#" color="success">
              대기중..
            </Badge>
          </div>
        </>
      ) : (
        <>
          <div className="memberName">{memberInfo.name}</div>
          <div className="memberBtnDiv">
            <Button
              className="memberXX"
              onClick={memberKickOut}
              color="success"
            >
              강퇴
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Member;
//userName !== memberInfo.name
