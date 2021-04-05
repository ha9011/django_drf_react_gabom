import React, { useState } from "react";
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
import "../house/noticeItem.scss";
const AdminNoticeItem = ({
  notice,
  idx,
  setNotice,
  houseId,
  type,
  noticeList,
}) => {
  const { store } = useAppContext();
  const [noticeContent, setNoticeContent] = useState({
    title: notice.title,
    content: notice.content,
  });

  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };
  const showNoticeModal = () => {
    setModal(!modal);
  };

  // 공지사항 글 작성
  const noticeWrite = (e) => {
    const { name, value } = e.target;
    setNoticeContent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  //모달 (공지사항)
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  // 공지사항 글 작성 완료
  const noticeSave = () => {
    async function fn() {
      try {
        let response = await Axios.put(
          `http://localhost:8000/gabomAdmin/notice/${notice.id}`,
          { content: noticeContent, houseId: houseId },
          config
        );
        console.log("qwewqewqewqe");
        console.log(response);
        setNotice(response.data);
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

  // 공지사항 글 작성 완료
  const noticeDelete = () => {
    async function fn() {
      try {
        let response = await Axios.delete(
          `http://localhost:8000/gabomAdmin/notice/${notice.id}`,

          config
        );
        console.log("qwewqewqewqe");
        console.log(response);
        console.log(noticeList);
        console.log(notice.id);
        setNotice(noticeList.filter((item) => item.id !== notice.id));
        //toggle();
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
      <div className="noticeItemDiv" onClick={showNoticeModal}>
        <h2 className="noticeItemCount">
          <Badge color="secondary"> {idx + 1}</Badge>
        </h2>
        <div className="noticeItemTitle">{notice.title}</div>
        <div className="noticeItemDate">{notice.created_at.substr(0, 10)}</div>
      </div>

      {/* 모달 */}
      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>공지사항</ModalHeader>
          <ModalBody>
            <span className="noticeModalTitle">제 목 : </span>
            {type === "0" ? (
              <>
                <input
                  onChange={noticeWrite}
                  name="title"
                  value={noticeContent["title"]}
                ></input>
                <textarea
                  className="noticeContent"
                  name="content"
                  onChange={noticeWrite}
                  placeholder="공지할 글 작성"
                  cols="56"
                  rows="10"
                  value={noticeContent["content"]}
                ></textarea>
              </>
            ) : (
              <>
                <input
                  name="title"
                  value={notice.title}
                  readOnly="true"
                ></input>
                <textarea
                  className="noticeContent"
                  name="content"
                  placeholder="공지할 글 작성"
                  cols="56"
                  rows="10"
                  value={notice.content}
                  readOnly="true"
                ></textarea>{" "}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            {type === "0" ? (
              <>
                <Button color="primary" onClick={noticeSave}>
                  수정
                </Button>
                <Button color="primary" onClick={noticeDelete}>
                  삭제
                </Button>
              </>
            ) : (
              ""
            )}

            <Button color="secondary" onClick={toggle}>
              취소
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default AdminNoticeItem;
