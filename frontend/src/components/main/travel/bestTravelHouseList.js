import React, { useState, useEffect } from "react";
import { Button, Input, Badge } from "reactstrap";

import Axios from "axios";
import "./bestSharePlanList.scss";
import { useAppContext } from "store";

const BestTravelHouseList = () => {
  const [bestHouseType, setBestHouseType] = useState(false);
  const [shareList, setShareList] = useState([]);
  const [scoreList, setScoreList] = useState([]);
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  useEffect(() => {
    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          `http://localhost:8000/houses/best-house/0`, // 0 좋아요 순
          config
        );
        console.log("메인 여행 리스트11");
        console.log(response);
        setShareList(response.data);
      } catch (error) {
        alert("플랜불러오기 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  }, []);

  const searchHouseCountClick = () => {
    // 날짜 갯수

    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          `http://localhost:8000/houses/best-house/0`,
          config
        );
        console.log("메인 여행 리스트11");
        console.log(response);
        setShareList(response.data);
        setBestHouseType(false);
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

  const searchHouseAverageClick = () => {
    // 날짜 갯수

    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          `http://localhost:8000/houses/best-house/1`,
          config
        );
        console.log("메인 여행 리스트11");
        console.log(response);
        setShareList(response.data.houseList);
        setScoreList(response.data.score);
        setBestHouseType(true);
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

  return (
    <div>
      <div className="shareInputs">
        <div>
          <h3>
            <Badge>Best 숙소 5</Badge>
          </h3>
        </div>
        <div>
          <Button onClick={searchHouseCountClick}>좋아요 순</Button>
        </div>

        <div>
          <Button onClick={searchHouseAverageClick}>평점 순</Button>
        </div>
      </div>
      <div className="bestHouseListBody">
        {bestHouseType
          ? shareList.map((i, idx) => (
              <div key={i.pk} className="houseCotainer">
                <div className="houseTitle">{i.houseName}</div>
                <img
                  alt="이미지"
                  width="100%"
                  height="150px"
                  src={`http://localhost:8000${i.mainImage}`}
                />
                <div className="houseAddress">{i.houseAddress}</div>
                <div className="score">
                  <Button color="primary" outline>
                    평점{" "}
                    <Badge color="secondary">
                      {String(scoreList[idx]).substr(0, 3)}
                    </Badge>
                  </Button>
                </div>
              </div>
            ))
          : shareList.map((i, idx) => (
              <div key={i.pk} className="houseCotainer">
                <div className="houseTitle">{i.houseName}</div>
                <img
                  alt="이미지"
                  width="100%"
                  height="150px"
                  src={`http://localhost:8000${i.mainImage}`}
                />
                <div className="houseAddress">{i.houseAddress}</div>
                <div className="score">
                  <Button color="primary" outline>
                    좋아요 <Badge color="secondary">{i.like}</Badge>
                  </Button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default BestTravelHouseList;
