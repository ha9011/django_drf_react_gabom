import React, { useState } from "react";
import {
  VscDiffModified,
  VscDebugStart,
  VscDebugStepBack,
  VscDiffRemoved,
} from "react-icons/vsc";
import Axios from "axios";
import { Tooltip } from "reactstrap";
import { useAppContext } from "store";
import "../house/qnaReple.scss";
const AdminQnaReple = ({ info, idx, repleList, setRepleList, type }) => {
  const { store } = useAppContext();
  const [modifyActive, setModifyActive] = useState(false);
  const [repleContentOrigin, setRepleContentOrigin] = useState(info.content);
  const [repleContentModi, setRepleContentModi] = useState(info.content);

  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  // 삭제
  const [tooltipOpenRemo, setTooltipOpenRemo] = useState(false);

  const toggleRemo = () => {
    console.log("toggleRemo");
    setTooltipOpenRemo(!tooltipOpenRemo);
  };

  // 수정
  const [tooltipOpenModi, setTooltipOpenModi] = useState(false);

  const toggleModi = () => {
    console.log("toggleModi");
    setTooltipOpenModi(!tooltipOpenModi);
  };

  // 돌아가기
  const [tooltipOpenBack, setTooltipOpenBack] = useState(false);

  const toggleBack = () => {
    console.log("toggleBack");
    setTooltipOpenBack(!tooltipOpenBack);
  };

  // 수정완료
  const [tooltipOpenStart, setTooltipOpenStart] = useState(false);

  const toggleStart = () => {
    console.log("toggleStart");
    setTooltipOpenStart(!tooltipOpenStart);
  };

  const onModifiReple = () => {
    setModifyActive(true);
  };

  const onModifiCancelReple = () => {
    setRepleContentModi(repleContentOrigin);
    setModifyActive(false);
  };

  const onModifiActiveReple = () => {
    async function fn() {
      try {
        let response = await Axios.put(
          `http://localhost:8000/gabomAdmin/qna-reple/${info.pk}`,
          { content: repleContentModi },
          config
        );
        console.log("qwewqewqewqe");
        console.log(response);
        //setRepleList(response.data);

        setModifyActive(false);
      } catch (error) {
        alert("공지사항 등록 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  };

  const onDeleteReple = () => {
    async function fn() {
      try {
        let response = await Axios.delete(
          `http://localhost:8000/gabomAdmin/qna-reple/${info.pk}`,

          config
        );
        console.log("qwewqewqewqe");
        console.log(response);
        console.log(repleList);
        setRepleList(repleList.filter((item) => item.pk !== info.pk));
      } catch (error) {
        alert("공지사항 등록 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  };

  console.log("info : ", info);
  return (
    <div className="qnaRepleDiv">
      <div className="qnaRepleLeft">
        <div>
          <img
            alt={"프로필"}
            width="50"
            height="50"
            src={
              store.userName === info.user.name && type === "0"
                ? "http://localhost:8000/media/public/home.png"
                : `http://localhost:8000${info.user.profile.avatar}`
            }
          ></img>
        </div>
        <div>
          {store.userName === info.user.name && type === "0"
            ? "집주인"
            : info.user.name}
        </div>
      </div>
      <div className="qnaRepleRight">
        <div className="qnaRepleModalContent">
          <div>
            {modifyActive ? (
              <textarea
                cols="45"
                rows="2"
                onChange={(e) => {
                  setRepleContentModi(e.target.value);
                }}
                value={repleContentModi}
              ></textarea>
            ) : (
              <textarea
                readOnly={true}
                cols="45"
                rows="2"
                value={repleContentModi}
              ></textarea>
            )}
          </div>
          {store.userName === info.user.name && (
            <div>
              <div className={modifyActive && "repleActiveBtn"}>
                <VscDiffModified onClick={onModifiReple} id={"modi" + idx} />
                <Tooltip
                  placement="right"
                  isOpen={tooltipOpenModi}
                  target={"modi" + idx}
                  toggle={toggleModi}
                >
                  수정
                </Tooltip>
                <br></br>
                <VscDiffRemoved
                  onClick={onDeleteReple}
                  id={"remo" + idx}
                />{" "}
                <Tooltip
                  placement="right"
                  isOpen={tooltipOpenRemo}
                  target={"remo" + idx}
                  toggle={toggleRemo}
                >
                  삭제
                </Tooltip>
              </div>
              <div className={!modifyActive && "repleActiveBtn"}>
                <VscDebugStart
                  onClick={onModifiActiveReple}
                  id={"start" + idx}
                />
                <Tooltip
                  placement="right"
                  isOpen={tooltipOpenStart}
                  target={"start" + idx}
                  toggle={toggleStart}
                >
                  수정완료
                </Tooltip>
                <br></br>
                <VscDebugStepBack
                  onClick={onModifiCancelReple}
                  id={"back" + idx}
                />{" "}
                <Tooltip
                  placement="right"
                  isOpen={tooltipOpenBack}
                  target={"back" + idx}
                  toggle={toggleBack}
                >
                  돌아가기
                </Tooltip>
              </div>
            </div>
          )}
        </div>
        <div className="qnaRepleModalDate">
          {info.created_at.substr(0, 10) + " " + info.created_at.substr(11, 8)}
        </div>
      </div>
    </div>
  );
};

export default AdminQnaReple;
