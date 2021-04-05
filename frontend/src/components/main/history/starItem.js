import React from "react";
import star from "public/img/star.png";
const StarItem = ({
  index,

  setClickStar,
  currentScore,
  setCurrentScore,
  setCheckClick,
  checkClick,
}) => {
  const onLeaveStar = () => {
    console.log("index : " + index);
    if (index === 0 && checkClick === false) {
      setCurrentScore(0);
    }
  };
  const onFocusStar = () => {
    if (checkClick === false) {
      setCurrentScore(index + 1);
    }
  };

  const onClickStar = () => {
    setCheckClick(true);
    setCurrentScore(index + 1);
  };
  return (
    <span
      onMouseOver={onFocusStar}
      onMouseLeave={onLeaveStar}
      onClick={onClickStar}
    >
      <img src={star} alt="noscore" width="30px" height="30px" />
    </span>
  );
};

export default StarItem;
