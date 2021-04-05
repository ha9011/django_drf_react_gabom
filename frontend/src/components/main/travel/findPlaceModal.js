import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Axios from "axios";
import { useAppContext } from "store";
import "./findPlaceModal.scss";
import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";
import FindPlaceList from "./findPlaceList";
import ChoicePlace from "./choicePlace";

const FindPlaceModal = ({
  modal,
  toggle,
  areaCode,
  setDetailPlanInfo,
  nthDay,

  detailPlanInfo,
}) => {
  console.log("findmoald============");
  console.log("detailPlanInfo : ", detailPlanInfo);
  // 체크
  const [listOrChoice, setListOrChoice] = useState(true);
  // 선택한 placeId
  const [placeId, setPlaceId] = useState(0);

  const [spinner, setSpinner] = useState(true);
  const [sigungu, setSigungu] = useState();
  const [areaNum, setAreaNum] = useState(areaCode);
  const [sigunguNum, setSigunguNum] = useState();
  const page = useRef(1);
  const showPlaceCount = useRef(9);
  const [areaCodeOption] = useState([
    ["1", "서울"],
    ["2", "인천"],
    ["3", "대전"],
    ["4", "대구"],
    ["5", "광주"],
    ["6", "부산"],
    ["7", "울산"],
    ["8", "세종"],
    ["31", "경기도"],
    ["32", "강원도"],
    ["33", "충처북도"],
    ["34", "충청남도"],
    ["35", "경상북도"],
    ["36", "경상남도"],
    ["37", "전라북도"],
    ["38", "전라남도"],
    ["39", "제주도"],
  ]);

  const [places, setPlaces] = useState({ items: [] });

  const [totalPlace, setTotalPlace] = useState();

  const { store } = useAppContext();

  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  useEffect(() => {
    setPlaces({ items: [] });
    setAreaNum(areaCode);
    setSpinner(true);
    async function fn() {
      try {
        let response = await Axios.get(
          `http://localhost:8000/plans/areacode/${areaCode}`,
          config
        );
        console.log(response);
        setSigungu(response.data);
      } catch (error) {
        alert("지역코드 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    modal && fn();
  }, [modal, areaCode]);

  const onChangeAreaCode = (e) => {
    setListOrChoice(true);
    const value = e.target.value;

    setAreaNum(value);
    async function fn() {
      try {
        let response = await Axios.get(
          `http://localhost:8000/plans/areacode/${value}`,
          config
        );
        console.log(response);
        setSigungu(response.data);
      } catch (error) {
        alert("시군구 찾기 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  };

  const onChangeSiGunGuCode = (e) => {
    const value = e.target.value;
    setPlaces({ items: [] });
    setSpinner(false);
    setSigunguNum(value);
    setListOrChoice(true);
    async function fn() {
      try {
        let response = await Axios.get(
          `http://localhost:8000/plans/sigungu/${areaNum}/${value}/${page.current}`,
          config
        );
        console.log(response);
        setSpinner(true);
        response.data.items !== undefined
          ? setPlaces(response.data)
          : setPlaces({ items: [] });

        setTotalPlace(response.data.totalCount);
      } catch (error) {
        alert("장소 검색 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  };

  const onClickLeft = () => {
    if (Number(places.pageNo) >= 2) {
      setListOrChoice(true);
      setPlaces({ items: [] });
      setSpinner(false);
      const minusPageNo = Number(places.pageNo) - 1;
      async function fn() {
        try {
          let response = await Axios.get(
            `http://localhost:8000/plans/sigungu/${areaNum}/${sigunguNum}/${minusPageNo}`,
            config
          );
          console.log(response);
          setSpinner(true);
          response.data.items !== undefined
            ? setPlaces(response.data)
            : setPlaces({ items: [] });

          setTotalPlace(response.data.totalCount);
        } catch (error) {
          alert("장소 검색 실패");
          console.log(error);
          if (error.response) {
            console.log(error.response);
          }
        }
      }

      fn();
    } else {
      return;
    }
  };

  const onClickRight = () => {
    if (Number(places.totalPage) > Number(places.pageNo)) {
      setListOrChoice(true);
      setPlaces({ items: [] });
      setSpinner(false);
      const plusPageNo = Number(places.pageNo) + 1;
      async function fn() {
        try {
          let response = await Axios.get(
            `http://localhost:8000/plans/sigungu/${areaNum}/${sigunguNum}/${plusPageNo}`,
            config
          );
          console.log(response);
          setSpinner(true);
          response.data.items !== undefined
            ? setPlaces(response.data)
            : setPlaces({ items: [] });

          setTotalPlace(response.data.totalCount);
        } catch (error) {
          alert("장소 검색 실패");
          console.log(error);
          if (error.response) {
            console.log(error.response);
          }
        }
      }

      fn();
    } else {
      return;
    }
  };
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} size="lg" className="findPlace">
        <ModalHeader toggle={toggle}>
          <div>여행 고르기</div>
          <div className="placeSearchTopInputs">
            <Row form>
              <Col md={6}>
                <Input
                  onChange={onChangeAreaCode}
                  type="select"
                  name="location"
                  id="location"
                  value={areaNum}
                >
                  {areaCodeOption.map((i, idx) => (
                    <option key={idx} value={i[0]}>
                      {i[1]}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col md={6}>
                <Input
                  onChange={onChangeSiGunGuCode}
                  type="select"
                  name="location"
                  id="location"
                >
                  <option>{"선택"}</option>
                  {sigungu &&
                    sigungu.map((i) => (
                      <option key={i.rnum} value={i.code}>
                        {i.name}
                      </option>
                    ))}
                </Input>
              </Col>
            </Row>
            <div>
              {places.items.length !== 0 && listOrChoice && (
                <>
                  <AiOutlineCaretLeft onClick={onClickLeft} />
                  <span>{places.pageNo}</span>/<span>{places.totalPage}</span>
                  <AiOutlineCaretRight onClick={onClickRight} />
                </>
              )}
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="qweqwe">
          {listOrChoice === true ? (
            // 해당 검색어의 여행 리스트
            <FindPlaceList
              setPlaceId={setPlaceId}
              choicePlace={() => setListOrChoice(!listOrChoice)}
              spinner={spinner}
              placeList={places.items}
            />
          ) : (
            //   여행 선택 화면
            <ChoicePlace
              choicePlace={() => setListOrChoice(!listOrChoice)}
              placeId={placeId}
              setDetailPlanInfo={setDetailPlanInfo}
              nthDay={nthDay}
              detailPlanInfo={detailPlanInfo}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default FindPlaceModal;
