import React, { useState } from "react";
import "./travelMyFriendSearch.scss";
import { Button } from "reactstrap";
import TravelMyFriendInputId from "./travelMyFriendInputId";
import TravelMyFriendInputPhone from "./travelMyFriendInputPhone";
import FriendSearchRow from "../friend/friendSearchRow";

const TravelMyFriendSearch = ({
  setApplyList,
  applyList,
  setFriendInfo,

  toggle,
}) => {
  const [searchType, setSearchType] = useState(false);
  const [searchList, setSearchList] = useState([]);

  const toggleIdSearch = () => {
    if (searchType) {
      return;
    }
    setSearchType(!searchType);
  };

  const togglePhoneSearch = () => {
    if (!searchType) {
      return;
    }
    setSearchType(!searchType);
  };
  return (
    <div className="searchContain">
      <div className="searchTitle">
        <div className="title1">친구 검색 하기</div>
        <div className="title2">
          <Button outline color="secondary" onClick={toggleIdSearch}>
            아이디
          </Button>
        </div>
        <div className="title3">
          <Button outline color="secondary" onClick={togglePhoneSearch}>
            번호
          </Button>
        </div>
      </div>
      <div className="searchBar">
        {searchType ? (
          <TravelMyFriendInputId setSearch={setSearchList} />
        ) : (
          <TravelMyFriendInputPhone setSearch={setSearchList} />
        )}
      </div>
      <div className="searchResultList">
        {searchList.map((item, index) => (
          <FriendSearchRow
            key={item.pk}
            friendInfo={item}
            searchList={searchList}
            setSearchList={setSearchList}
            applyList={applyList}
            setApplyList={setApplyList}
            setFriendInfo={setFriendInfo}
            toggle={toggle}
          />
        ))}
      </div>
    </div>
  );
};

export default TravelMyFriendSearch;
