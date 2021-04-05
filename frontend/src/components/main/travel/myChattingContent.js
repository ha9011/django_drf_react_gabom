import React from "react";
import "./myChattingContent.scss";
const MyChattingContent = ({ message }) => {
  return (
    <div className="messageDiv">
      <div className="myMessage">{message}</div>
    </div>
  );
};

export default MyChattingContent;
