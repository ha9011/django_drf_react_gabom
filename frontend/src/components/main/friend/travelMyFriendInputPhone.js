import React, { useState } from "react";
import "./travelMyFriendInputPhone.scss";
import { Button } from "reactstrap";
import Axios from "axios";
import { useAppContext } from "store";

const TravelMyFriendInputPhone = ({ setSearch }) => {
  const [phone, setPhone] = useState("");
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  // 검색버튼 클릭
  const searchByPhone = () => {
    if (phone.length === 0) {
      return;
    }

    async function fn() {
      try {
        let response = await Axios.get(
          `http://localhost:8000/friend/search/p/${phone}`,
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

  const searchInputPhone = (e) => {
    const phone = e.target.value;
    setPhone(phone);
  };
  return (
    <>
      <input
        onChange={searchInputPhone}
        className="searchInput"
        type="text"
        placeholder=" (' - ') 없이 핸드폰 번호"
      />
      <Button onClick={searchByPhone} className="searchBtn" color="secondary">
        검색
      </Button>{" "}
    </>
  );
};

export default TravelMyFriendInputPhone;
