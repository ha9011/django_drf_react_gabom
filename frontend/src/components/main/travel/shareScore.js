import React, { useState, useEffect } from "react";
import NoStarItem from "../history/noStarItem";
import StarItem from "../history/starItem";

const ShareScore = ({ shareScore, setshareScore }) => {
  const [checkClick, setCheckClick] = useState(false);
  return (
    <>
      <div>
        {[...Array(5)].map((n, index) => {
          return index < shareScore ? (
            <StarItem
              key={index}
              index={index}
              setCurrentScore={setshareScore}
              currentScore={shareScore}
              setCheckClick={setCheckClick}
              checkClick={checkClick}
            />
          ) : (
            <NoStarItem
              key={index}
              index={index}
              setCurrentScore={setshareScore}
              currentScore={shareScore}
              setCheckClick={setCheckClick}
              checkClick={checkClick}
            />
          );
        })}
        <span> 별점 : {shareScore}</span>
      </div>
    </>
  );
};

export default ShareScore;
