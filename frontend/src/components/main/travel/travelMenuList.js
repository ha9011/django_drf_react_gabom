import React from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import { Route, Link, useHistory } from "react-router-dom";
const TravelMenuList = ({ setMenu }) => {
  let history = useHistory();

  const onClickMoveTravelMain = () => {
    setMenu(0);
  };

  const onClickMoveTravelMyTravel = () => {
    setMenu(1);
  };

  const onClickMoveTravelMyFriend = () => {
    setMenu(2);
  };
  const onClickMoveMyHistory = () => {
    setMenu(3);
  };

  return (
    <div>
      <ListGroup>
        <ListGroupItem onClick={onClickMoveTravelMain} action>
          메인
        </ListGroupItem>

        <ListGroupItem onClick={onClickMoveTravelMyTravel} action>
          내 여행
        </ListGroupItem>
        <ListGroupItem onClick={onClickMoveTravelMyFriend} action>
          친구 목록
        </ListGroupItem>
        <ListGroupItem onClick={onClickMoveMyHistory} action>
          내역
        </ListGroupItem>
      </ListGroup>
    </div>
  );
};

export default TravelMenuList;
