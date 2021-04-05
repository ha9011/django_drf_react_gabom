import HouseRecognize from "components/main/house/houseRecognize";
import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import Axios from "axios";
import { useAppContext } from "store";
import HouseRegist from "components/main/house/houseRegist";
import HouseUpdate from "components/main/house/houseUpdate";

const HouseRecognizePage = () => {
  const { store } = useAppContext();
  const [houseCurrentInfo, setHouseCurrentInfo] = useState([]);
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  useEffect(() => {
    Axios.get("http://localhost:8000/houses/houseinfo/", config).then(
      (response) => {
        setHouseCurrentInfo(response.data);
      }
    );
  }, []);

  return (
    <>
      <div>
        <Route
          exact
          path="/index/main/house/manage/info"
          component={HouseRegist}
        />

        <Route
          path="/index/main/house/manage"
          component={() => (
            <HouseRecognize
              house={houseCurrentInfo}
              setHouse={setHouseCurrentInfo}
            />
          )}
        />
      </div>
    </>
  );
};

export default HouseRecognizePage;
