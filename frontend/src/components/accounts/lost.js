import React from "react";

import { Button, Card, CardText, CardBody, CardTitle, Badge } from "reactstrap";
import { Link } from "react-router-dom";
const Lost = () => {
  return (
    <>
      <div class="typeArea">
        <div>아이디, 비밀번호 찾기, 선택해주세요</div>
        <div class="cardArea">
          <Link to="/index/check?type=1">
            <h2>
              <Badge href="#" color="info">
                <CardText>아이디</CardText>
              </Badge>
            </h2>
          </Link>
          <span>
            {"\u00A0"}
            {"\u00A0"}
            {"\u00A0"}
          </span>
          <Link to="/index/check?type=2">
            <h2>
              <Badge href="#" color="info">
                <CardText>비밀번호</CardText>
              </Badge>
            </h2>
          </Link>
        </div>
        <div>
          <Link to="/index">
            <Button className="firstBtn" outline color="secondary">
              돌아가기
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Lost;
