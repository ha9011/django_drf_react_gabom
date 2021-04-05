import React from "react";
import "./chattingContent.scss";
const ChattingContent = ({ message, img, name }) => {
  return (
    <div className="friendMessageDiv">
      <div className="friendMessageInfoDiv">
        <div>
          <img
            className="friendImg"
            width="50px"
            height="50px"
            src={img}
            alt="프로필"
          />
        </div>
      </div>
      <div>
        <div className="friendName">{name}</div>
        <div className="friendMessage">{message}</div>
      </div>
    </div>
  );
};

export default ChattingContent;
