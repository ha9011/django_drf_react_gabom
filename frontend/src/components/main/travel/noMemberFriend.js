import React from "react";
import { Button } from "reactstrap";
import Axios from "axios";
import { useAppContext } from "store";
import "./member.scss";
const NoMemberFriend = ({
  planNo,
  memberInfo,
  state,
  setMember,
  memberList,
  setNoMember,
  noMemberList,
}) => {
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };
  console.log("==noMemeber==");
  console.log(planNo);
  console.log(memberInfo);
  console.log(state);
  console.log(memberList);
  console.log(noMemberList);

  const memberInvite = () => {
    async function fn() {
      try {
        let response = await Axios.post(
          `http://localhost:8000/plans/invite/`,
          { user: memberInfo.pk, plan: planNo, state: "0", complete: "0" },
          config
        );

        console.log("맴버초대");

        console.log(response.data);
        // 노맴버에서 삭제
        setNoMember(
          noMemberList.filter((info) => info.userFrom.pk !== memberInfo.pk)
        );
        // 맴버에서 추가
        setMember(memberList.concat(response.data));

        // 소켓 날리기
        store.userSocket.send(
          JSON.stringify({
            message: `${store.userName}님께서 여행에 초대하셨습니다.`,
            move_msg: "이동",
            planId: planNo,

            userPk: memberInfo.pk,
          })
        );
      } catch (error) {
        alert("맴버초대 실패");
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
      <div className="memberName">{memberInfo.name}</div>

      <div className="memberBtnDiv">
        <Button
          className="memberBtn"
          onClick={memberInvite}
          color="success"
          size="sm"
        >
          초대
        </Button>
      </div>
    </div>
  );
};

export default NoMemberFriend;
