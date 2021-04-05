import React, { useState } from "react";
import { Button } from "reactstrap";
import "./houseReject.scss";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import { useAppContext } from "store";
const HouseEnd = ({ info, setHouse, house }) => {
  const history = useHistory();
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  // 삭제
  const houseDelete = () => {
    async function fn() {
      try {
        // 전송
        let response = await Axios.delete(
          `http://localhost:8000/houses/delete-house/${info.pk}`,
          config
        );

        console.log("==houseDelete==");
        console.log(response);
        setHouse(house.filter((item) => item.pk !== info.pk));
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

  const moveUpdateHouse = () => {
    history.push("/index/main/house/update/" + info.pk + "/2");
  };
  return (
    <>
      <div className="houseManageRow">
        <div className="houseManageRowImg">
          <img
            src={"http://localhost:8000" + info.mainImage}
            alt="mainImg"
            width="100px"
            height="80px"
          />
        </div>
        <div className="houseManageRowTitle">
          <span className="rejectHouseName">{info.houseName}</span>
        </div>
        <div className="houseManageRowState">
          <Button color="secondary" id={"rejectHouseId" + info.pk}>
            기간만료
          </Button>
        </div>
        <div className="houseManageRowBtn">
          <div>
            <Button color="danger" onClick={moveUpdateHouse}>
              수정
            </Button>
            <Button color="danger" onClick={houseDelete}>
              삭제
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HouseEnd;
