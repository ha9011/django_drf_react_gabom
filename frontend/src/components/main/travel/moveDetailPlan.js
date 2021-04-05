import React, { useEffect } from "react";
import {
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  FormGroup,
  Label,
} from "reactstrap";
import DatePicker from "react-datepicker";
import Axios from "axios";
import { useAppContext } from "store";
import "./dateChangeModal.scss";
import { useHistory } from "react-router-dom";

const MoveDetailPlan = ({
  date,
  modal,
  toggle,
  planId,
  planDateId,
  nthDay,
}) => {
  console.log("===MoveDetailPlan===");
  console.log("date : ", date);
  console.log("planId : ", planId);
  console.log("planDateId : ", planDateId);
  console.log("nthDay : ", nthDay);

  useEffect(() => {
    modal && alert("gg");
  }, [modal]);

  const closeMoveModal = () => {
    toggle();
  };
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} size="lg" className="asd">
        <ModalHeader toggle={toggle}>
          <div>
            <div>계획 이동 시키기</div>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="changeDateModalBody">
            <div>
              <Label for="exampleState">Start Date : </Label>
              <br />
              <input />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={null}>
            변경
          </Button>
          <Button color="secondary" onClick={closeMoveModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default MoveDetailPlan;
