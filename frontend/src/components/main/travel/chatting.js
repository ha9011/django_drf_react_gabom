import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "store";
import { Button } from "reactstrap";
import "./chatting.scss";
import Axios from "axios";
import Member from "./member";
import NoMemberFriend from "./noMemberFriend";
import { useHistory } from "react-router-dom";
import ChattingContent from "./chattingContent";
import MyChattingContent from "./myChattingContent";
const Chatting = ({
  room,

  state,
  detailPlanInfo,
  setDetailPlanInfo,
  member,
  setMember,
  noMember,
  setNoMember,
}) => {
  let history = useHistory();
  const [chatting, setChatting] = useState([]);
  const [chattingInputm, setChattingInput] = useState("");
  const { store } = useAppContext();
  const [chatSocket, setChatSocket] = useState();
  const [chatCount, setChatCount] = useState(0);
  const [chatStep, setChatStep] = useState(1);
  // 스크롤
  const scrollRef = useRef();

  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };
  console.log("===Chatting==");
  useEffect(() => {
    console.log("===chatSocket : ===", chatSocket);
    chatSocket === undefined &&
      setChatSocket(new WebSocket("ws://127.0.0.1:8000/ws/chat/" + room + "/"));

    // 메세지 받을 때!
    chatSocket !== undefined &&
      (chatSocket.onmessage = function (e) {
        var data = JSON.parse(e.data);
        data["message"]["pk"] = chatCount + 1;
        var jsonData = [data["message"]];

        console.log("data : ", data);
        console.log("message11 : ", jsonData);
        setChatting(chatting.concat(jsonData));

        const { scrollHeight, clientHeight, scrollTop } = scrollRef.current;
        console.log(scrollRef.current);
        console.dir(scrollRef.current);
        console.log("스크롤========22", scrollHeight, clientHeight, scrollTop);

        scrollRef.current.scrollTop = scrollHeight - clientHeight;

        //document.querySelector("#chat-log").value += message + "\n";
      });

    chatSocket !== undefined &&
      (chatSocket.onclose = function (e) {
        console.error("Chat socket closed unexpectedly");
      });
    console.log("===effex==");
  }, [chatSocket, chatting]);

  useEffect(() => {
    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          `http://localhost:8000/chat/getContent/${room}/${chatStep}`,
          config
        );
        console.log("===채팅 가져오기 성공===111");
        console.log(response);
        setChatting(chatting.concat(response.data));
        setChatCount(response.data.length);

        setChatStep(chatStep + 1);
        const { scrollHeight, clientHeight, scrollTop } = scrollRef.current;
        console.log(scrollRef.current);
        console.log("스크롤========11", scrollHeight, clientHeight, scrollTop);

        scrollRef.current.scrollTop = scrollHeight - clientHeight;
      } catch (error) {
        alert("채팅 가져오기 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  }, []);

  //   chatSocket.onclose = function (e) {
  //     console.error("Chat socket closed unexpectedly");
  //   };

  // 채팅 전송
  const EnterSend = (e) => {
    console.log(e.key);
    if (e.key === "Enter") {
      console.log("전송");
      console.log("store", store);
      chatSocket.send(
        JSON.stringify({
          message: e.target.value,
          userImg: store.userImg,
          userName: store.userName,
          planNo: room,
        })
      );
      setChattingInput("");

      async function fn() {
        try {
          // 전송
          let response = Axios.post(
            `http://localhost:8000/chat/save/`,
            {
              message: e.target.value,
              userImg: store.userImg,
              userName: store.userName,
              planNo: room,
            },
            config
          );
          console.log(response);
        } catch (error) {
          alert("로그인실패");
          console.log(error);
          if (error.response) {
            console.log(error.response);
          }
        }
      }

      fn();
    }
  };

  // 채팅 입력하기
  const OnChangeInputDate = (e) => {
    const val = e.target.value;
    setChattingInput(val);
  };

  // 여행 탈퇴하기
  const clickTravelPlanWithdraw = () => {
    async function fn() {
      try {
        let response = await Axios.post(
          `http://localhost:8000/plans/withdraw/${room}`,

          {
            // 서버에서 req.body.{} 로 확인할 수 있다.
            state: state,
          },
          config
        );

        console.log("여행 탈퇴하기");
        console.log(response);
        history.push(`/index/main/travel/manage`);
      } catch (error) {
        alert("여행 탈퇴하기 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }
    if (state === "1") {
      let withdrawCheck = window.confirm(
        "방장이 탈퇴 할 경우, 모든 회원도 같이 탈퇴가 됩니다. 그래도 하시겠습니까?"
      );

      withdrawCheck && fn();
    } else {
      fn();
    }
  };

  const onGetChattingData = (e) => {
    console.log("==onGetChattingData===");
    const { scrollHeight, clientHeight, scrollTop } = e.target;
    console.log(e.target);
    console.log("스크롤========@@", scrollHeight, clientHeight, scrollTop);

    if (scrollHeight > clientHeight && scrollTop === 0) {
      let preScrollHeight = scrollHeight;
      async function fn() {
        try {
          // 전송
          let response = await Axios.get(
            `http://localhost:8000/chat/getContent/${room}/${chatStep}`,
            config
          );
          console.log("===채팅 가져오기 성공===111");
          console.log(response);
          setChatting(response.data.concat(chatting));
          setChatCount(chatCount + response.data.length);
          setChatStep(chatStep + 1);

          const { scrollHeight, clientHeight, scrollTop } = scrollRef.current;
          console.log(scrollRef.current);
          console.log(
            "스크롤========@@33",
            scrollHeight,
            clientHeight,
            scrollTop
          );

          scrollRef.current.scrollTop = scrollHeight - preScrollHeight;
        } catch (error) {
          alert("채팅 가져오기 실패");
          console.log(error);
          if (error.response) {
            console.log(error.response);
          }
        }
      }

      fn();
    }
  };
  return (
    <>
      <div className="chattingDiv">
        <div className="chattingContainner">
          <div
            className="chattingContent"
            ref={(e) => {
              console.log(e);
              scrollRef.current = e;
            }}
            onScroll={onGetChattingData}
          >
            {chatting.map(
              (item, idx) =>
                item.userName === store.userName ? (
                  <MyChattingContent key={item.pk} message={item.message} />
                ) : (
                  <ChattingContent
                    key={item.pk}
                    message={item.message}
                    img={item.userImg}
                    name={item.userName}
                  />
                )
              // <div>{item.message}</div>
            )}
          </div>
          <div>
            <input
              className="chattingInput"
              onChange={OnChangeInputDate}
              onKeyPress={EnterSend}
              value={chattingInputm}
            />
            <button className="chattingBtn" type="button">
              전송
            </button>
          </div>
        </div>
      </div>

      <div className="members">
        <div className="planMemberList1">
          <div>
            <div className="title1">여행 맴버</div>
          </div>

          <div className="memberList">
            {member.map((item, index) => (
              <Member
                index={index}
                planNo={room}
                key={item.user.pk}
                memberInfo={item.user}
                state={state}
                setMember={setMember}
                memberList={member}
                setNoMember={setNoMember}
                noMemberList={noMember}
              />
            ))}
          </div>
        </div>

        <div className="planMemberList2">
          <div>
            <div className="title1">초대할 친구들</div>
          </div>

          <div className="searchResultList">
            {noMember.map((item, index) => (
              <NoMemberFriend
                planNo={room}
                key={item.userFrom.pk}
                memberInfo={item.userFrom}
                state={state}
                setMember={setMember}
                memberList={member}
                setNoMember={setNoMember}
                noMemberList={noMember}
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        <Button
          color="danger"
          size="lg"
          block
          onClick={clickTravelPlanWithdraw}
          className="kickoutBtn"
        >
          탈퇴 하기
        </Button>
      </div>
    </>
  );
};

export default Chatting;
