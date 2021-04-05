import React from "react";
import noStar from "public/img/star-line.png";
const NoStarItem = ({
  index,

  currentScore,
  setCurrentScore,
  checkClick,
  setCheckClick,
}) => {
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
    <span onMouseOver={onFocusStar} onClick={onClickStar}>
      <img src={noStar} alt="noscore" width="30px" height="30px" />
    </span>
  );
};

export default NoStarItem;
