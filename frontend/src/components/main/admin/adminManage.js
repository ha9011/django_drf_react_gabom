import React, { useState, useEffect } from "react";
import {
  Button,
  Nav,
  NavItem,
  NavLink,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import { BsPencilSquare } from "react-icons/bs";

import Axios from "axios";
import { useAppContext } from "store";
import "./adminManage.scss";
import AdminEvaluateList from "./adminEvaluateList";
import ShowDetailPlan from "./showDetailPlan";
import ShowDetailHouse from "./showDetailHouse";
import NoticeItem from "../house/noticeItem";
import QnaItem from "../house/qnaItem";
import AdminNoticeItem from "./adminNoticeItem";
import AdminQnaItem from "./adminQnaItem";
const AdminManage = () => {
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  //false 여행 // true 숙소
  const [evaluateType, setEvaluateType] = useState(false);
  const [choiceId, setChoiceId] = useState(0);
  const [houseList, setHouseList] = useState([]);
  const [planList, setPlanList] = useState([]);

  // 공지사항 모달
  //모달 (공지사항)
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  // 질문 글
  const [qna, setQna] = useState([]);
  // 공지 글
  const [notice, setNotice] = useState([]);
  // 공지 사항 글 내용
  const [noticeContent, setNoticeContent] = useState({
    title: "",
    content: "",
  });
  // 공지사항 글 작성
  const noticeWrite = (e) => {
    const { name, value } = e.target;
    setNoticeContent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showNoticeModal = () => {
    setModal(!modal);
  };
  //
  useEffect(() => {
    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          `http://localhost:8000/gabomAdmin/noticeAndQna/`,
          config
        );

        setNotice(response.data.notice);
        setQna(response.data.qna);
      } catch (error) {
        alert("플랜불러오기 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  }, []);

  // 공지사항 글 작성 완료
  const noticeSave = () => {
    async function fn() {
      try {
        let response = await Axios.post(
          `http://localhost:8000/gabomAdmin/notice/0`,
          { content: noticeContent },
          config
        );
        console.log(response);
        setNotice(notice.concat([response.data]));
        toggle();
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

  return (
    <>
      <div className="adminMain">
        <div className="adminMainContainer adminTop">
          <div>
            <div className="memberInPlan">
              <Nav tabs>
                <NavItem className="adminTitle ">
                  <NavLink> 심사화면 </NavLink>
                </NavItem>
              </Nav>
            </div>
            <div className="adminContentTop">
              <AdminEvaluateList
                evaluateType={evaluateType}
                setEvaluateType={setEvaluateType}
                setChoiceId={setChoiceId}
                planList={planList}
                houseList={houseList}
                setHouseList={setHouseList}
                setPlanList={setPlanList}
              />
              {choiceId === 0 ? (
                <div className="adminContentTopInner"></div>
              ) : evaluateType === false && choiceId !== 0 ? (
                <>
                  <ShowDetailPlan
                    choiceId={choiceId}
                    planList={planList}
                    setPlanList={setPlanList}
                    setChoiceId={setChoiceId}
                  />
                </>
              ) : (
                <>
                  <ShowDetailHouse
                    choiceId={choiceId}
                    houseList={houseList}
                    setHouseList={setHouseList}
                    setChoiceId={setChoiceId}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <div className="adminMainContainer adminBottom">
          <div className="adminBoard">
            <div className="memberInPlan">
              <Nav tabs>
                <NavItem className="adminTitle ">
                  <NavLink>
                    {" "}
                    공지사항{" "}
                    <BsPencilSquare
                      className="writeBtn"
                      onClick={showNoticeModal}
                    />{" "}
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
            <div className="adminContent">
              {notice.map((item, idx) => (
                <AdminNoticeItem
                  type="0"
                  idx={idx}
                  key={item.id}
                  notice={item}
                  setNotice={setNotice}
                  noticeList={notice}
                />
              ))}
            </div>
          </div>
          <div className="adminBoard">
            <div className="memberInPlan">
              <Nav tabs>
                <NavItem className="adminTitle ">
                  <NavLink> 질문사항 </NavLink>
                </NavItem>
              </Nav>
            </div>
            <div className="adminContent">
              {qna.map((item, idx) => (
                <AdminQnaItem
                  type="0"
                  idx={idx}
                  key={item.pk}
                  qna={item}
                  qnaList={qna}
                  setQna={setQna}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* 모달 */}
      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>공지사항</ModalHeader>
          <ModalBody>
            <span className="noticeModalTitle">제 목 : </span>
            <input onChange={noticeWrite} name="title"></input>
            <textarea
              className="noticeContent"
              name="content"
              onChange={noticeWrite}
              placeholder="공지할 글 작성"
              cols="56"
              rows="10"
            ></textarea>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={noticeSave}>
              작성
            </Button>{" "}
            <Button color="secondary" onClick={toggle}>
              취소
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};
export default AdminManage;
