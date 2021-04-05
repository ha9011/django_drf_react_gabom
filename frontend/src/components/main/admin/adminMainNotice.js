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

import AdminNoticeItem from "./adminNoticeItem";
import AdminQnaItem from "./adminQnaItem";
const AdminMainNotice = () => {
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  //false 여행 // true 숙소
  const [myPostType, setMyPostType] = useState(false);
  const [choiceId, setChoiceId] = useState(0);
  const [houseList, setHouseList] = useState([]);
  const [planList, setPlanList] = useState([]);

  // 질문 글
  const [qna, setQna] = useState([]);
  // 공지 글
  const [notice, setNotice] = useState([]);

  //모달 (질문)
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  // 질문
  const [qnAContent, setQnAContent] = useState({
    title: "",
    content: "",
    public: false,
  });
  // 질문 글 작성
  const qnaWrite = (e) => {
    const { name, value } = e.target;
    if (name === "public") {
      setQnAContent((prev) => ({
        ...prev,
        [name]: !qnAContent["public"],
      }));
    } else {
      setQnAContent((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const myPost = () => {
    async function fn() {
      try {
        // 전송
        let type = !myPostType ? "0" : "1";
        let response = await Axios.get(
          `http://localhost:8000/gabomAdmin/qantype/${type}`,
          config
        );

        setQna(response.data);
        setMyPostType(!myPostType);
      } catch (error) {
        alert("플랜불러오기 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
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

  // 질문사항 글 작성 완료
  const QnaSave = () => {
    console.log(qnAContent);
    async function fn() {
      try {
        let response = await Axios.post(
          `http://localhost:8000/gabomAdmin/qna/0`,
          { content: qnAContent },
          config
        );
        console.log(response);
        setQna(qna.concat([response.data]));
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
        <div className="adminMainContainer adminBottom">
          <div className="adminBoard">
            <div className="memberInPlan">
              <Nav tabs>
                <NavItem className="adminTitle ">
                  <NavLink> 공지사항 </NavLink>
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
                  <NavLink>
                    {" "}
                    질문사항{" "}
                    <BsPencilSquare
                      className="writeBtn"
                      onClick={showNoticeModal}
                    />{" "}
                    <span className="adminMyPost">
                      내가 쓴 글만 보기{" "}
                      <input
                        type="checkbox"
                        onChange={myPost}
                        name="public"
                      ></input>
                    </span>
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
            <div className="adminContent">
              {qna.map((item, idx) => (
                <AdminQnaItem
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
          <ModalHeader toggle={toggle}>문의사항</ModalHeader>
          <ModalBody>
            <span className="noticeModalTitle">제 목 : </span>
            <input
              required={true}
              onChange={qnaWrite}
              name="title"
              className="QnATitle"
            ></input>
            <textarea
              required={true}
              className="noticeContent"
              name="content"
              onChange={qnaWrite}
              placeholder="내용"
              cols="56"
              rows="10"
            ></textarea>
            공개 여부(체크 시 비공개){" "}
            <input type="checkbox" onChange={qnaWrite} name="public"></input>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={QnaSave}>
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

export default AdminMainNotice;
