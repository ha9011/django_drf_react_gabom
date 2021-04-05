import React from "react";
import housetype from "public/img/housetype.jpg";
import traveltype from "public/img/traveltype.jpg";
import { Button, Card, CardText, CardBody, CardTitle, Badge } from "reactstrap";
import { Link } from "react-router-dom";
import "./type.scss";
const Type = () => {
  return (
    <>
      <div class="typeArea">
        <div>
          <span>선택해주세요</span>
        </div>

        <div class="cardArea">
          <Card className="typeCard">
            <CardBody>
              <CardTitle className="typeCardTitle" tag="h5">
                Travel
              </CardTitle>
            </CardBody>
            <img src={traveltype} alt="여행객" width="100%" height="30%" />
            <CardBody className="typeCardText">
              <Link to="/index/join?type=1">
                <Badge href="#" color="info">
                  <CardText>여행객으로 가입</CardText>
                </Badge>
              </Link>
            </CardBody>
          </Card>

          <Card className="typeCard">
            <CardBody>
              <CardTitle className="typeCardTitle" tag="h5">
                HouseSharer
              </CardTitle>
            </CardBody>
            <img src={housetype} alt="숙박업체" width="100%" height="30%" />
            <CardBody className="typeCardText">
              <Link to="/index/join?type=2">
                <Badge href="#" color="info">
                  <CardText>숙소공유자로 가입</CardText>
                </Badge>
              </Link>
            </CardBody>
          </Card>
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

export default Type;
