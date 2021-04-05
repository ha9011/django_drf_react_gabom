import React from "react";
import { Button } from "reactstrap";
import Axios from "axios";
import { useAppContext } from "store";
import "./houseWaitting.scss";
import { useHistory } from "react-router-dom";
const HouseWaitting = ({ info, setHouse, house }) => {
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
    history.push("/index/main/house/update/" + info.pk + "/0");
  };
  return (
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
        <span className="waittingHouseName">{info.houseName}</span>
      </div>
      <div className="houseManageRowState">
        <Button color="warning">Waitting...</Button>
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
  );
};

export default HouseWaitting;
