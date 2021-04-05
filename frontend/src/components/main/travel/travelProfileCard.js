import React, { useState, useEffect } from "react";
import { useAppContext } from "store";
import Axios from "axios";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import basicProfileImg from "public/img/basic.JPG";
import "./travelProfileCard.scss";
import MyEditProfileForm from "./myEditProfileForm";
import MyEditPWForm from "./myEditPWForm";

const TravelProfileCard = () => {
  const [myProfile, setMyProfile] = useState();
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  useEffect(() => {
    Axios.get("http://localhost:8000/accounts/userprofile/", config).then(
      (response) => {
        setMyProfile(response.data);
        console.log(response.data);
      }
    );
  }, []);

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const [pwModal, setPwModal] = useState(false);

  const pwToggle = () => setPwModal(!pwModal);

  return (
    <>
      <div className="profileCard">
        {myProfile && (
          <Card>
            <CardImg
              className="myImgCard"
              src={`http://localhost:8000${myProfile.avatar}`}
              alt="Card image cap"
            />
            <CardBody>
              <CardTitle tag="h5">{myProfile.user.name}</CardTitle>
              <CardText>{myProfile.introduce}</CardText>
              <CardText>
                <Button outline onClick={toggle} color="secondary">
                  프로필 변경
                </Button>
                <span> </span>
                <Button outline onClick={pwToggle} color="secondary">
                  비밀번호 변경
                </Button>
              </CardText>
            </CardBody>
          </Card>
        )}
      </div>
      <div>
        {/* 프로필변경 */}
        <Modal isOpen={modal} toggle={toggle} className="editProfile">
          <ModalHeader toggle={toggle}>프로필 변경</ModalHeader>
          <ModalBody>
            <MyEditProfileForm
              myInfo={myProfile}
              editToggle={toggle}
              setMyinfo={setMyProfile}
            />
          </ModalBody>
        </Modal>
        {/* 비밀번호 변경 */}
        <Modal isOpen={pwModal} toggle={pwToggle} className="editProfile">
          <ModalHeader toggle={pwToggle}>비밀번호 변경</ModalHeader>
          <ModalBody>
            <MyEditPWForm editToggle={pwToggle} />
          </ModalBody>
        </Modal>
      </div>
    </>
  );
};

export default TravelProfileCard;
