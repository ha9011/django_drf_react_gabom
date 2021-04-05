import React, { useState, useEffect } from "react";
import { Button, Input, Badge } from "reactstrap";
import SharePlanList from "./sharePlanList";
import Axios from "axios";
import "./bestSharePlanList.scss";
import { useAppContext } from "store";
import BestSharePlanListAvg from "./bestSharePlanListAvg";
import BestShareList from "./bestShareList";
import BestSharePlanItem from "./bestSharePlanItem";
const BestSharePlanList = ({ setChoiceShare }) => {
  const [bestShareType, setBestShareType] = useState(false);
  const [shareList, setShareList] = useState([]);
  const [scoreList, setScoreList] = useState([]);
  const [rangeDate, setRangeDate] = useState(0);
  const [areaCode, setAreaCode] = useState(0);
  const [location, setLocation] = useState("");
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
          `http://localhost:8000/plans/best-share/0`, // 0 공유 순
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

  const searchShareCountClick = () => {
    // 날짜 갯수

    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          `http://localhost:8000/plans/best-share/0`,
          config
        );
        console.log("메인 여행 리스트11");
        console.log(response);
        setShareList(response.data);
        setBestShareType(false);
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

  const searchShareAverageClick = () => {
    // 날짜 갯수

    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          `http://localhost:8000/plans/best-share/1`,
          config
        );
        console.log("메인 여행 리스트11");
        console.log(response);
        setShareList(response.data.sharePlan);
        setScoreList(response.data.score);
        setBestShareType(true);
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
            <Badge>Best 여행 5</Badge>
          </h3>
        </div>
        <div>
          <Button onClick={searchShareCountClick}>공유 순</Button>
        </div>

        <div>
          <Button onClick={searchShareAverageClick}>평점 순</Button>
        </div>
      </div>
      <div className="bestShareListBody">
        {bestShareType
          ? shareList.map((item, idx) => (
              <BestSharePlanListAvg
                idx={idx}
                key={item.id}
                id={item.id}
                basicInfo={item}
                setChoiceShare={setChoiceShare}
                setRangeDate={setRangeDate}
                setAreaCode={setAreaCode}
                setLocation={setLocation}
                avgScore={scoreList[idx]}
              />
            ))
          : shareList.map((item, idx) => (
              <BestSharePlanItem
                idx={idx}
                key={item.id}
                id={item.id}
                basicInfo={item}
                setChoiceShare={setChoiceShare}
                setRangeDate={setRangeDate}
                setAreaCode={setAreaCode}
                setLocation={setLocation}
              />
            ))}
        {/* {shareList.map((item, idx) => (
          <BestSharePlanList
            idx={idx}
            key={item.id}
            id={item.id}
            basicInfo={item}
            setChoiceShare={setChoiceShare}
            setRangeDate={setRangeDate}
            setAreaCode={setAreaCode}
            setLocation={setLocation}
          />
        ))} */}
      </div>
    </div>
  );
};

export default BestSharePlanList;
