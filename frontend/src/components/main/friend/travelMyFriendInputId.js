import React, { useState } from "react";
import "./travelMyFriendInputId.scss";
import { Button } from "reactstrap";
import Axios from "axios";
import { useAppContext } from "store";
const TravelMyFriendInputId = ({ setSearch }) => {
  const [userId, setUserId] = useState("");
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  // 검색버튼 클릭
  const searchById = () => {
    if (userId.length === 0) {
      return;
    }

    async function fn() {
      try {
        let response = await Axios.get(
          `http://localhost:8000/friend/search/i/${userId}`,
          config
        );
        console.log(response);
        setSearch(response.data);
      } catch (error) {
        alert("친구 검색 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  };

  const searchInputId = (e) => {
    const userId = e.target.value;
    setUserId(userId);
  };

  return (
    <>
      <input
        onChange={searchInputId}
        className="searchInput"
        type="text"
        placeholder="아이디"
      />
      <Button onClick={searchById} className="searchBtn" color="secondary">
        검색
      </Button>
    </>
  );
};

export default TravelMyFriendInputId;
