import React, { useState } from "react";
import "./collectPlaceItem.scss";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
} from "reactstrap";
import {
  BsFillCaretUpFill,
  BsFillCaretDownFill,
  BsCardText,
  BsXSquareFill,
} from "react-icons/bs";
import produce from "immer";
import { useHistory } from "react-router-dom";

const HOUST_USER = "/index/main/house/choice/";

const CollectPlaceItem = ({
  index,
  info,
  nthDay,
  setDetailPlanInfo,
  detailInfo,
  basicInfo,
}) => {
  console.log("===info==== move_turn : " + info["move_turn"]);
  console.log(info);
  console.log(detailInfo);
  console.log(detailInfo["detailPlace"]);
  console.log(basicInfo);
  const history = useHistory();
  const [memoContent, setMemoContent] = useState(info["place_memo"]);
  //모달
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  // 순서 변경
  const placeTurnUp = () => {
    //제거값
    console.log("전");
    console.log(detailInfo["detailPlace"]);
    const sortingField = "move_turn";
    const currentTurn = Number(info["move_turn"]); // 1 2 3
    let modifiedArray;
    if (currentTurn === 1) {
      modifiedArray = detailInfo["detailPlace"]
        .map((item) =>
          item.move_turn === currentTurn
            ? { ...item, move_turn: Number(detailInfo["detailPlace"].length) }
            : { ...item, move_turn: Number(item.move_turn) - 1 }
        )
        .sort(function (a, b) {
          // 오름차순
          return a[sortingField] - b[sortingField];
          // 13, 21, 25, 44
        });
    } else {
      modifiedArray = detailInfo["detailPlace"]
        .map((item) =>
          item.move_turn === currentTurn
            ? { ...item, move_turn: currentTurn - 1 }
            : item.move_turn === currentTurn - 1
            ? { ...item, move_turn: currentTurn }
            : item
        )
        .sort(function (a, b) {
          // 오름차순
          return a[sortingField] - b[sortingField];
          // 13, 21, 25, 44
        });
    }

    setDetailPlanInfo(
      produce((draft) => {
        draft.schedule[nthDay - 1].detailPlace = modifiedArray;
      })
    );
  };
  const placeTurnDown = () => {
    //제거값
    console.log("전");
    console.log(detailInfo["detailPlace"]);
    const sortingField = "move_turn";
    const currentTurn = Number(info["move_turn"]); // 1 2 3
    let modifiedArray;
    if (currentTurn === detailInfo["detailPlace"].length) {
      modifiedArray = detailInfo["detailPlace"]
        .map((item) =>
          item.move_turn === detailInfo["detailPlace"].length
            ? { ...item, move_turn: 1 }
            : { ...item, move_turn: Number(item.move_turn) + 1 }
        )
        .sort(function (a, b) {
          // 오름차순
          return a[sortingField] - b[sortingField];
          // 13, 21, 25, 44
        });
    } else {
      modifiedArray = detailInfo["detailPlace"]
        .map((item) =>
          item.move_turn === currentTurn
            ? { ...item, move_turn: currentTurn + 1 }
            : item.move_turn === currentTurn + 1
            ? { ...item, move_turn: currentTurn }
            : item
        )
        .sort(function (a, b) {
          // 오름차순
          return a[sortingField] - b[sortingField];
          // 13, 21, 25, 44
        });
    }

    setDetailPlanInfo(
      produce((draft) => {
        draft.schedule[nthDay - 1].detailPlace = modifiedArray;
      })
    );
  };

  const placeDelete = () => {
    const currentTurn = Number(info["move_turn"]); // 1 2 3
    const modifiedArray = detailInfo["detailPlace"]
      .filter((info) => info.move_turn !== currentTurn)
      .map((item, index) => ({ ...item, move_turn: index + 1 }));

    console.log(modifiedArray);
    setDetailPlanInfo(
      produce((draft) => {
        draft.schedule[nthDay - 1].detailPlace = modifiedArray;
      })
    );
  };

  const houseDelete = () => {
    const reservation_id = info.reservation_id;
    const check = window.confirm(
      "예약된 숙소를 지우고, 저장할 경우, 예약이 취소가 됩니다. 그래도 하시겠습니까?"
    );

    if (check === true) {
      for (let i = 0; i < basicInfo.schedule.length; i++) {
        let detailPlaces = basicInfo.schedule[i]["detailPlace"];
        for (let j = 0; j < detailPlaces.length; j++) {
          if (detailPlaces[j]["reservation_id"] === reservation_id) {
            let reservation_turn = j + 1;

            let modifiedArray = detailPlaces
              .filter((item) => item.move_turn !== reservation_turn)
              .map((item, index) => ({ ...item, move_turn: index + 1 }));

            console.log(modifiedArray);
            setDetailPlanInfo(
              produce((draft) => {
                draft.schedule[i].detailPlace = modifiedArray;
              })
            );
          }
        }
      }
      const currentTurn = Number(info["move_turn"]); // 1 2 3
    } else {
      return;
    }
  };

  const recoHouseDelete = () => {
    const reservation_id = info.reservation_id;
    const check = window.confirm(
      "공유계획에 추천된 숙소를 더 이상 안보시겠습니까? 확인 후 저장해주세요"
    );

    if (check === true) {
      for (let i = 0; i < basicInfo.schedule.length; i++) {
        let detailPlaces = basicInfo.schedule[i]["detailPlace"];
        for (let j = 0; j < detailPlaces.length; j++) {
          if (detailPlaces[j]["reservation_id"] === reservation_id) {
            let reservation_turn = j + 1;

            let modifiedArray = detailPlaces
              .filter((item) => item.move_turn !== reservation_turn)
              .map((item, index) => ({ ...item, move_turn: index + 1 }));

            console.log(modifiedArray);
            setDetailPlanInfo(
              produce((draft) => {
                draft.schedule[i].detailPlace = modifiedArray;
              })
            );
          }
        }
      }
      const currentTurn = Number(info["move_turn"]); // 1 2 3
    } else {
      return;
    }
  };

  // 하우스 입장
  const enterHouseClick = () => {
    history.push({
      pathname: HOUST_USER + info["house_id"],

      state: {
        sDate: basicInfo["start_date"],
        eDate: basicInfo["end_date"],
        search: 1,
        planId: basicInfo["pk"],
        reco: true,
        move_turn: info["move_turn"],
        reservation_id: info["reservation_id"],
      },
    });
  };

  const chageMemo = (e) => {
    console.log(e.target.value);
    const currentTurn = Number(info["move_turn"]) - 1; // 1 2 3
    setMemoContent(e.target.value);

    setDetailPlanInfo(
      produce((draft) => {
        draft.schedule[nthDay - 1].detailPlace[
          currentTurn
        ].place_memo = memoContent;
      })
    );
  };
  // const onInputMemo = () => {
  //   console.log(memoContent);
  //   const currentTurn = Number(info["move_turn"]) - 1; // 1 2 3
  //   setDetailPlanInfo(
  //     produce((draft) => {
  //       draft.schedule[nthDay - 1].detailPlace[
  //         currentTurn
  //       ].place_memo = memoContent;
  //     })
  //   );
  //   toggle();
  // };
  return (
    <>
      <div className="placeUnit">
        <div className="placeUpDown">
          <div>
            <BsFillCaretUpFill onClick={placeTurnUp} />
          </div>

          <div>
            <BsFillCaretDownFill onClick={placeTurnDown} />
          </div>
        </div>
        <div>
          <Button
            className={"displayBtn" + (index + 1) + " btnArea"}
            color="primary"
            onMouseEnter={(e) => {
              let className = e.target.classList[0];
              document.getElementsByClassName(
                className
              )[0].style.backgroundColor = "red";

              document.getElementsByClassName(
                className
              )[1].style.backgroundColor = "red";
            }}
            onMouseLeave={(e) => {
              let className = e.target.classList[0];
              document.getElementsByClassName(
                className
              )[0].style.backgroundColor = "#007bff";

              document.getElementsByClassName(
                className
              )[1].style.backgroundColor = "#007bff";
            }}
          >
            <Badge className="placeTurn" color="secondary">
              {info.move_turn}
            </Badge>
          </Button>
        </div>
        <div className="placeImg">
          <img width="100%" src={info.detail_img} alt={info.place_name} />
        </div>
        <div className="placeName">{info.place_name}</div>
        <div className="placeLocation">{info.place_location}</div>
        <div className="placeMemo">
          {info.place_type === "2" ? (
            <Button
              className="placeTurn"
              color="secondary"
              onClick={enterHouseClick}
            >
              예약
            </Button>
          ) : (
            <BsCardText onClick={toggle} />
          )}
        </div>
        <div className="palceDelete">
          {info.place_type === "0" ? (
            <BsXSquareFill onClick={placeDelete} />
          ) : info.place_type === "1" &&
            getCurrentDateCompare(detailInfo.date) ? (
            <BsXSquareFill onClick={houseDelete} />
          ) : info.place_type === "1" &&
            !getCurrentDateCompare(detailInfo.date) ? (
            "만료"
          ) : (
            info.place_type === "2" && (
              <BsXSquareFill onClick={recoHouseDelete} />
            )
          )}
        </div>
      </div>
      <div>
        <Modal
          isOpen={modal}
          modalTransition={{ timeout: 700 }}
          backdropTransition={{ timeout: 1300 }}
          toggle={toggle}
          className="placeMemoModal"
        >
          <ModalHeader toggle={toggle}>{info["place_name"]}</ModalHeader>
          <ModalBody>
            <textarea
              onChange={chageMemo}
              rows="10"
              cols="50"
              style={{
                display: "inline-block",
                width: "100%",
                height: "100%",
              }}
            >
              {memoContent}
            </textarea>
          </ModalBody>
          <ModalFooter>
            {/* <Button color="primary" onClick={onInputMemo}>
              저장
            </Button>{" "} */}
            <Button color="secondary" onClick={toggle}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

function getCurrentDateCompare(choiceDate) {
  console.log("==getCurrentDateCompare==");
  let date1 = new Date();
  let date2 = new Date(choiceDate);
  // 예약 날짜가 같거나, 과거이면, 이미 지났으므로 삭제 X 할수 없다
  if (date2 <= date1) {
    return false;
  } else {
    return true;
  }
}

export default CollectPlaceItem;
