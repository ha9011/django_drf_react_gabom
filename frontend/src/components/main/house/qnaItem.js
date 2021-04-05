import React, { useState, useEffect } from "react";
import { VscAccount, VscKey } from "react-icons/vsc";
import Axios from "axios";
import {
  Badge,
  Modal,
  ModalHeader,
  Button,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useAppContext } from "store";
import "./qnaItem.scss";
import QnaReple from "./qnaReple";

const QnaItem = ({ idx, qna, qnaList, setQna, houseId, type }) => {
  const { store } = useAppContext();
  console.log("===houseId : ", houseId);
  console.log("===qna : ", qna);
  console.log("===qnaList : ", qnaList);
  console.log("===store : ", store);

  // 오리진
  const [originQnaContent, setOriginQnaContent] = useState({
    title: qna.title,
    content: qna.content,
    public: qna.public,
  });

  const [qnaContent, setQnaContent] = useState({
    title: qna.title,
    content: qna.content,
    public: qna.public,
  });
  const [repleList, setRepleList] = useState([]);

  const [repleContent, setRepleContent] = useState("");
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  const [repleActive, setRepleActive] = useState(false);

  useEffect(() => {
    setOriginQnaContent({
      title: qna.title,
      content: qna.content,
      public: qna.public,
    });

    setQnaContent({
      title: qna.title,
      content: qna.content,
      public: qna.public,
    });
  }, []);

  const showQnaModal = () => {
    async function fn() {
      try {
        let response = await Axios.get(
          `http://localhost:8000/houses/qna-reple/${qna.pk}`,

          config
        );
        console.log("댓글 가져오기");
        console.log(response);
        setRepleList(response.data);
      } catch (error) {
        alert("댓글 가져오기 등록 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    // 작성자면
    if (store.userName === qna.user.name) {
      setModal(!modal);
      fn();
      // 작성자는 다르나 공개이면
    } else if (store.userName !== qna.user.name && qna.public === false) {
      setModal(!modal);
      fn();

      // 하우스 운영자
    } else if (type === "0") {
      setModal(!modal);
      fn();

      // 작성자는 다르나 비공개이면
    } else if (store.userName !== qna.user.name && qna.public === true) {
      alert("비공개 게시물 입니다.");
    }
  };

  const toggleInit = () => {
    setQnaContent(originQnaContent);
    toggle();
  };
  // 공지사항 글 작성
  const qnaWrite = (e) => {
    const { name, value } = e.target;
    if (name === "public") {
      setQnaContent((prev) => ({
        ...prev,
        [name]: !qnaContent["public"],
      }));
    } else {
      setQnaContent((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  //모달 (공지사항)
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
    setRepleActive(false);
  };
  // 문의사항 업데이트
  const qnaSave = () => {
    async function fn() {
      try {
        let response = await Axios.put(
          `http://localhost:8000/houses/qna/${qna.pk}`,
          { content: qnaContent, houseId: houseId },
          config
        );
        console.log("qwewqewqewqe");
        console.log(response);
        setQna(response.data);
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

  // 문의사항 삭제
  const qnaDelete = () => {
    async function fn() {
      try {
        let response = await Axios.delete(
          `http://localhost:8000/houses/qna/${qna.pk}`,

          config
        );
        console.log("qwewqewqewqe");
        console.log(response);
        setQna(qnaList.filter((item) => item.pk !== qna.pk));
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

  // 대댓글
  const writeReple = () => {
    setRepleActive(!repleActive);
  };
  const repleChange = (e) => {
    let value = e.target.value;
    setRepleContent(value);
  };
  // 댓글 쓰기
  const repleSave = () => {
    async function fn() {
      try {
        let response = await Axios.post(
          `http://localhost:8000/houses/qna-reple/${qna.pk}`,
          { content: repleContent, houseId: houseId },
          config
        );
        console.log("qwewqewqewqe");
        console.log(response);
        setRepleList(repleList.concat(response.data));
        setRepleContent("");
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
      <div className="qnaBoardDiv" onClick={showQnaModal}>
        <div className="qnaBoardDivOrderDiv">
          <h2>
            <Badge color="secondary" className="qnaBoardDivOrder">
              {" "}
              {idx + 1}
            </Badge>
          </h2>
        </div>
        <div className="qnaBoardUserDiv">
          <div>
            <img
              alt={"프로필"}
              width="50"
              height="50"
              src={`http://localhost:8000${qna.user.profile.avatar}`}
            ></img>
          </div>
          <div>{qna.user.name}</div>
        </div>
        <div className="qnaBoardTitleDiv">
          <div className="qnaBoardTitle">{qna.title}</div>
        </div>
        <div className="qnaBoardDateDiv">
          <div className="qnaBoardDate">{qna.created_at.substr(0, 10)}</div>
        </div>
        <div className="qnaBoardImgDiv">
          {store.userName === qna.user.name && <VscAccount />}
          {qna.public === true && <VscKey />}
        </div>
      </div>

      {/* 모달 */}
      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader>문의사항</ModalHeader>
          <ModalBody>
            <span className="noticeModalTitle">제 목 : </span>
            {store.userName === qna.user.name ? (
              <>
                <input
                  onChange={qnaWrite}
                  name="title"
                  value={qnaContent["title"]}
                ></input>
                <textarea
                  className="noticeContent"
                  name="content"
                  onChange={qnaWrite}
                  placeholder="공지할 글 작성"
                  defaultValue={qnaContent["content"]}
                  cols="56"
                  rows="10"
                ></textarea>
                공개 여부(체크 시 비공개){" "}
                <input
                  type="checkbox"
                  onChange={qnaWrite}
                  name="public"
                  checked={qnaContent["public"]}
                ></input>
                <hr />
                <div
                  className={
                    "repleModalDiv " +
                    (repleActive ? "repleModalActive" : "notRepleModalActive")
                  }
                >
                  <div>
                    <textarea
                      onChange={repleChange}
                      cols="50"
                      className=""
                      value={repleContent}
                    ></textarea>
                  </div>
                  <div>
                    <Button
                      color="primary"
                      className="repleModalBtn"
                      onClick={repleSave}
                    >
                      작성
                    </Button>
                  </div>
                </div>
                <hr />
                <div className="repleDivContain">
                  {repleList.map((item, idx) => (
                    <QnaReple
                      idx={idx}
                      key={item.pk}
                      info={item}
                      repleList={repleList}
                      setRepleList={setRepleList}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <input name="title" value={qna.title} readOnly={true}></input>
                <textarea
                  className="noticeContent"
                  name="content"
                  placeholder="공지할 글 작성"
                  cols="56"
                  rows="10"
                  defaultValue={qna.content}
                  readOnly={true}
                ></textarea>{" "}
                <hr />
                <div
                  className={
                    "repleModalDiv " +
                    (repleActive ? "repleModalActive" : "notRepleModalActive")
                  }
                >
                  <div>
                    <textarea
                      onChange={repleChange}
                      cols="50"
                      className=""
                      defaultValue={repleContent}
                    ></textarea>
                  </div>
                  <div>
                    <Button
                      color="primary"
                      className="repleModalBtn"
                      onClick={repleSave}
                    >
                      작성
                    </Button>
                  </div>
                </div>
                <hr />
                <div className="repleDivContain">
                  {repleList.map((item, idx) => (
                    <QnaReple
                      type="0"
                      idx={idx}
                      key={item.pk}
                      info={item}
                      repleList={repleList}
                      setRepleList={setRepleList}
                    />
                  ))}
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            {store.userName === qna.user.name ? (
              <>
                <Button color="primary" onClick={qnaSave}>
                  수정
                </Button>
                <Button color="secondary" onClick={qnaDelete}>
                  삭제
                </Button>
              </>
            ) : (
              ""
            )}

            <Button color="secondary" onClick={writeReple}>
              댓글쓰기
            </Button>
            <Button color="secondary" onClick={toggleInit}>
              취소
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default QnaItem;
