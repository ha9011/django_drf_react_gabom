import React, { useState, useEffect } from "react";
import NoStarItem from "./noStarItem";
import StarItem from "./starItem";

const StartScore = ({ currentScore, setCurrentScore }) => {
  const [checkClick, setCheckClick] = useState(false);

  return (
    <>
      <div>
        {[...Array(5)].map((n, index) => {
          return index < currentScore ? (
            <StarItem
              key={index}
              index={index}
              setCurrentScore={setCurrentScore}
              currentScore={currentScore}
              setCheckClick={setCheckClick}
              checkClick={checkClick}
            />
          ) : (
            <NoStarItem
              key={index}
              index={index}
              setCurrentScore={setCurrentScore}
              currentScore={currentScore}
              setCheckClick={setCheckClick}
              checkClick={checkClick}
            />
          );
        })}
        <span> 별점 : {currentScore}</span>
      </div>
    </>
  );
};

export default StartScore;
