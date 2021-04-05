import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import ShareTravelDetail from "./shareTravelDetail";
import { useAppContext } from "store";
import Axios from "axios";
import "./shareShowDetatil.scss";
const ShareShowDetatil = ({ choiceShare }) => {
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  const [shareInfo, setShareInfo] = useState(null);

  useEffect(() => {
    if (choiceShare === 0) {
      return;
    }

    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          `http://localhost:8000/plans/share-detail/${choiceShare}`,
          config
        );
        console.log("선택 공유 계획 ");
        console.log(response);
        setShareInfo(response.data);
      } catch (error) {
        alert("플랜불러오기 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  }, [choiceShare]);
  return (
    <div className="shareContentTopInner">
      {shareInfo !== null && (
        <ShareTravelDetail shareInfo={shareInfo} choiceShare={choiceShare} />
      )}
    </div>
  );
};

export default ShareShowDetatil;
