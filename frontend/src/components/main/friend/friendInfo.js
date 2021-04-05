import React from "react";
import {
  CardImg,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Tooltip,
} from "reactstrap";
const FriendInfo = ({ friendInfo }) => {
  return (
    <div>
      <div>
        <img
          className="myImgCardEdit "
          src={`http://localhost:8000${friendInfo.profile.avatar}` || ""}
          alt="Card cap"
        />
      </div>
      <br />
      <br />
      <form>
        <FormGroup row>
          <Label for="Name" sm={2}>
            Name
          </Label>
          <Col sm={9}>
            <Input
              type="text"
              name="name"
              id="name"
              value={friendInfo.name || ""}
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="Phone" sm={2}>
            Phone
          </Label>
          <Col sm={9}>
            <Input
              type="text"
              name="phone_number"
              id="phone_number"
              placeholder="('-')제외한 숫자 11자리"
              value={friendInfo.phone_number || ""}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="Phone" sm={2}>
            email
          </Label>
          <Col sm={9}>
            <Input
              type="text"
              name="phone_number"
              id="phone_number"
              placeholder="('-')제외한 숫자 11자리"
              value={friendInfo.email || ""}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="Phone" sm={2}>
            gender
          </Label>
          <Col sm={9}>
            <Input
              type="text"
              name="phone_number"
              id="phone_number"
              value={friendInfo.gender || ""}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="Introduce" sm={2}>
            Introduce
          </Label>
          <Col sm={9}>
            <Input
              type="textarea"
              name="introduce"
              id="introduce"
              value={friendInfo.profile.introduce || ""}
            />
          </Col>
        </FormGroup>
      </form>
    </div>
  );
};

export default FriendInfo;
