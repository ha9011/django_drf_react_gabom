import React, { useEffect, useState } from "react";
import "./travelMyFriend.scss";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import Axios from "axios";
import { useAppContext } from "store";
import TravelMyFriendSearch from "./travelMyFriendSearch";
import MyFriendApply from "./myFriendApply";
import FriendToMeApply from "./friendToMeApply";
import MyFriend from "./myFriend";
import FriendInfo from "./friendInfo";

const TravelMyFriend = () => {
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  // 친구 정보 pk
  const [friendInfo, setFriendInfo] = useState({});
  const [friendPk, setFriendPk] = useState(0);
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const [applyList, setApplyList] = useState([]);
  const [appliedList, setAppliedList] = useState([]);

  const [myFriend, setMyFriend] = useState([]);

  useEffect(() => {
    async function fn() {
      try {
        let response = await Axios.get(
          `http://localhost:8000/friend/`,

          config
        );
        console.log(response);
        setApplyList(applyList.concat(response.data.applyFriendS));
        setAppliedList(appliedList.concat(response.data.appliedFriendS));
        setMyFriend(myFriend.concat(response.data.myFriend));

        // applyList 필터 삭제
      } catch (error) {
        alert("친구 검색 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  }, []);
  return (
    <>
      <div className="friendMain">
        <div className="friendDiv">
          <MyFriend
            myFriend={myFriend}
            setMyFriend={setMyFriend}
            setFriendInfo={setFriendInfo}
            toggle={toggle}
          />
        </div>
        <div className="friendDiv">
          <TravelMyFriendSearch
            applyList={applyList}
            setApplyList={setApplyList}
            setFriendInfo={setFriendInfo}
            toggle={toggle}
          />
        </div>
        <div className="friendDiv">
          <MyFriendApply
            applyList={applyList}
            setApplyList={setApplyList}
            setFriendInfo={setFriendInfo}
            toggle={toggle}
          />
        </div>
        <div className="friendDiv">
          <FriendToMeApply
            appliedList={appliedList}
            setAppliedList={setAppliedList}
            myFriend={myFriend}
            setmyFriend={setMyFriend}
            setFriendInfo={setFriendInfo}
            toggle={toggle}
          />
        </div>
      </div>
      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>친구 정보</ModalHeader>
          <ModalBody>
            <FriendInfo friendInfo={friendInfo} />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default TravelMyFriend;
