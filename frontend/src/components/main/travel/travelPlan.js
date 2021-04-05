import React, { useState, useEffect } from "react";
import Chatting from "./chatting";
import TravelDetailPlan from "./travelDetailPlan";
import { useAppContext } from "store";
import "./travelPlan.scss";
import Axios from "axios";
import planLoading from "public/img/planLoading.png";
import { Spinner } from "reactstrap";
const TravelPlan = ({ match }) => {
  console.log("===TravelPlan===");
  console.log(match);
  console.log(match.params.id);
  const [state, setState] = useState();
  const [member, setMember] = useState([]);
  const [noMember, setNoMember] = useState([]);
  const [detailPlanInfo, setDetailPlanInfo] = useState({
    schedule: [{ detailPlace: [] }],
  });

  const [loading, setLoading] = useState(false);
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };
  useEffect(() => {
    async function fn1() {
      try {
        // 전송
        let response = await Axios.get(
          `http://localhost:8000/plans/detailplan/${match.params.id}`,
          config
        );
        console.log("==특정 여행 메인 데이터 ==");

        console.log(response.data);
        // [in response.data]
        // member
        // noMemberFriend
        // planInfo
        // state

        setMember(member.concat(response.data.member));
        setNoMember(noMember.concat(response.data.noMemberFriend));
        setDetailPlanInfo(response.data.planInfo[0]);
        setState(response.data.state);
        setLoading(true);
      } catch (error) {
        alert("여행 디테일 정보 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn1();
  }, []);

  return (
    <>
      {loading === false ? (
        <div className="detailPlan">
          <div className="planLoading">
            <img
              src={planLoading}
              alt="대기"
              width="200px"
              height="200px"
            ></img>
            <br></br>
            <span className="loadingText">waitting...</span>
            <Spinner color="info" />
          </div>
        </div>
      ) : (
        <div className="detailPlan">
          <div className="detailPlanContainer">
            <TravelDetailPlan
              loading={loading}
              match={match}
              state={state}
              setState={setState}
              detailPlanInfo={detailPlanInfo}
              setDetailPlanInfo={setDetailPlanInfo}
            />
          </div>
          <div className="chatting">
            <Chatting
              room={match.params.id}
              state={state}
              setState={setState}
              detailPlanInfo={detailPlanInfo}
              setDetailPlanInfo={setDetailPlanInfo}
              member={member}
              setMember={setMember}
              noMember={noMember}
              setNoMember={setNoMember}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TravelPlan;
