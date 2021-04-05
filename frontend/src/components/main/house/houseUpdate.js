import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useAppContext } from "store";
import DaumPostcode from "react-daum-postcode";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";
import { Form, FormGroup, Label, Input, Button, Modal } from "reactstrap";
import { useHistory } from "react-router-dom";
const { kakao } = window;
const HouseUpdate = ({ match }) => {
  console.log("==houseUpdate==");
  console.log(match);
  const [houseInfo, seHouseInfo] = useState({ housedetaiiImages: [] });
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };
  const [formData, setFormData] = useState({});
  const history = useHistory();
  const [imgData, setImgData] = useState({ resultUrl: [], mainUrl: "" });
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const buttonLabel = "주소찾기";
  const className = "addressModal";

  useEffect(() => {
    console.log("===houseUpdate 인포===");
    Axios.get(
      `http://localhost:8000/houses/housebyid/${match.params.pk}`,
      config
    )
      .then((response) => {
        console.log("====???====");
        console.log(response.data);

        seHouseInfo(response.data["houseInfo"]);

        setFormData((prev) => ({
          ...prev,
          // houseName: response.data["houseInfo"].houseName,

          // houseAddress: response.data["houseInfo"].houseAddress,
          // houseDetailAddress: response.data["houseInfo"].houseDetailAddress,
          // housePrice: response.data["houseInfo"].housePrice,

          // houseType: response.data["houseInfo"].houseType,
          // maxPerson: response.data["houseInfo"].maxPerson,
          // rooms: response.data["houseInfo"].rooms,
          // startDate: response.data["houseInfo"].startDate,
          // xPoint: response.data["houseInfo"].xPoint,
          // yPoint: response.data["houseInfo"].yPoint,
          // endDate: response.data["houseInfo"].endDate,
          // mainImage: response.data["houseInfo"].mainImage,
          // detailImage: response.data["houseInfo"].housedetaiiImages,
        }));

        // 메인 사진에 이미지 격납
        setImgData((prev) => ({
          ...prev,
          mainUrl:
            "http://localhost:8000" + response.data["houseInfo"].mainImage,
        }));
        // 디테일 사진 격납
        setImgData((prev) => ({
          ...prev,
          resultUrl: response.data["houseInfo"].housedetaiiImages.map(
            (item) => "http://localhost:8000/media/" + item
          ),
        }));

        const container = document.getElementById("myUpdateHouse");
        const options = {
          center: new kakao.maps.LatLng(
            response.data["houseInfo"].yPoint,
            response.data["houseInfo"].xPoint
          ),
          level: 3,
        };
        const map = new kakao.maps.Map(container, options);
        const geocoder = new kakao.maps.services.Geocoder();
        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(
          response.data["houseInfo"].houseAddress,
          function (result, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {
              const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

              // 결과값으로 받은 위치를 마커로 표시합니다
              const marker = new kakao.maps.Marker({
                map: map,
                position: coords,
              });

              // 인포윈도우로 장소에 대한 설명을 표시합니다
              const infowindow = new kakao.maps.InfoWindow({
                content:
                  '<div style="width:150px;text-align:center;padding:6px 0;">' +
                  response.data["houseInfo"].houseName +
                  "</div>",
              });
              infowindow.open(map, marker);

              // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
              map.setCenter(coords);
            }
          }
        );
      })
      .catch(function (error) {
        // handle error
        console.log(error.response);
      });
  }, []);

  //input 값 삽입했을 때
  const changeForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    seHouseInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //form data 전송
  const sendForm = (e) => {
    e.preventDefault();
    console.log("===form===");
    console.log(formData);
    const aFormData = new FormData();
    let keys = Object.keys(formData);
    console.log(keys);

    for (let i = 0; i < keys.length; i++) {
      console.log(keys[i] + " : " + formData[keys[i]]);
      if (keys[i] === "detailImage") {
        for (let j = 0; j < formData[keys[i]].length; j++) {
          aFormData.append("detailImage", formData[keys[i]][j]);
        }
      }
      aFormData.append(keys[i], formData[keys[i]]);
    }

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `JWT ${store.jwtToken}`,
      },
    };

    console.log("config ", config);
    console.log(aFormData);

    async function fn() {
      try {
        let response = await Axios.patch(
          `http://localhost:8000/houses/update-house/${match.params.pk}`,
          aFormData,
          config
        );

        console.log(response);
        history.push("/index/main/house/manage");
      } catch (error) {
        alert("로그인실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  };
  //디테일 이미지 변경 할 때
  const onDetailImgChange = (e) => {
    const { name, files } = e.target;
    console.log("==onDetailImgChange==");
    console.log(files);
    setFormData((prev) => ({
      ...prev,
      [name]: files,
    }));

    console.log(e);
    const filesObj = e.target.files;

    let resultUrl = [];
    let file;
    for (let idx = 0; idx < filesObj.length; idx++) {
      file = filesObj[idx];
      let reader = new FileReader();

      reader.onload = () => {
        resultUrl[idx] = reader.result;
        setImgData((prev) => ({
          ...prev,
          resultUrl,
        }));
      };
      console.log("ssend : ", imgData);
      reader.readAsDataURL(file);
    }
  };

  //메인 이미지 변경 할 때
  const onMainImgChange = (e) => {
    const { name, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      setImgData((prev) => ({
        ...prev,
        mainUrl: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // 왼쪽 클릭할때
  const onClickLetfDetail = () => {
    console.log("onClickLetfDetail ");
    let resultUrlList = imgData.resultUrl;
    let firstImg = resultUrlList[0];
    for (let idx = 1; idx < resultUrlList.length; idx++) {
      resultUrlList[idx - 1] = resultUrlList[idx];
    }
    resultUrlList[resultUrlList.length - 1] = firstImg;
    console.log("resultUrlList : ", resultUrlList);
    setImgData((prev) => ({
      ...prev,
      resultUrl: resultUrlList,
    }));
  };

  // 오른쪽 클릭할때
  const onClickRightDetail = () => {
    console.log("onClickLetfDetail ");
    let resultUrlList = imgData.resultUrl;
    let lastImg = resultUrlList[resultUrlList.length - 1];
    for (let idx = resultUrlList.length - 2; idx >= 0; idx--) {
      resultUrlList[idx + 1] = resultUrlList[idx];
    }
    resultUrlList[0] = lastImg;
    console.log("resultUrlList : ", resultUrlList);
    setImgData((prev) => ({
      ...prev,
      resultUrl: resultUrlList,
    }));
  };

  const postCodeStyle = {
    display: "block",
    position: "absolute",
    top: "50px",
    zIndex: "100",
    padding: "7px",
  };

  // 카카오지도
  const inputKaKaoMap = (e) => {
    console.log("............", e);
    setFormData((prev) => ({
      ...prev,
      houseAddress: e.roadAddress,
    }));

    const container = document.getElementById("myUpdateHouse");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);
    const geocoder = new kakao.maps.services.Geocoder();
    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(e.roadAddress, function (result, status) {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        setFormData((prev) => ({
          ...prev,
          xPoint: result[0].x,
          yPoint: result[0].y,
        }));
        // 결과값으로 받은 위치를 마커로 표시합니다
        const marker = new kakao.maps.Marker({
          map: map,
          position: coords,
        });

        // 인포윈도우로 장소에 대한 설명을 표시합니다
        const infowindow = new kakao.maps.InfoWindow({
          content:
            '<div style="width:150px;text-align:center;padding:6px 0;">' +
            e.roadAddress +
            "</div>",
        });
        infowindow.open(map, marker);

        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        map.setCenter(coords);
      }
    });

    toggle();
  };
  return (
    <>
      <div className="mainHR">
        <div className="formDiv">
          <br />
          <br />
          <br />
          <br />
          <div className="formTitle">
            <span>공유 집 등록</span>
          </div>
          <br />
          <br />
          <Form onSubmit={sendForm} className="formHR">
            <FormGroup>
              <Label for="HouseName">House Name</Label>

              <Input
                onChange={changeForm}
                name="houseName"
                id="houseName"
                placeholder="input house name"
                value={houseInfo["houseName"] || ""}
              />
            </FormGroup>
            <div className="myMap">
              {formData.houseAddress && (
                <div
                  id="myUpdateHouse"
                  style={{
                    width: "300px",
                    height: "300px",
                  }}
                ></div>
              )}
            </div>

            <FormGroup>
              <Label for="HouseAddress">House Address</Label>

              <Input
                onChange={changeForm}
                name="houseAddress"
                id="houseAddress"
                placeholder="input house address"
                value={houseInfo["houseAddress"] || ""}
              />
              <Input
                onChange={changeForm}
                name="houseDetailAddress"
                id="houseDetailAddress"
                placeholder="input detail house address"
                value={houseInfo["houseDetailAddress"] || ""}
              />
              <Button color="danger" onClick={toggle}>
                {buttonLabel}
              </Button>
            </FormGroup>

            <FormGroup>
              <Label for="HousePrice">House Price</Label>

              <Input
                onChange={changeForm}
                name="housePrice"
                id="housePrice"
                placeholder="input house price"
                value={houseInfo["housePrice"] || ""}
              />
            </FormGroup>

            <FormGroup>
              <Label for="HouseType">House Type</Label>

              <Input
                onChange={changeForm}
                name="houseType"
                id="houseType"
                placeholder="input house type"
                value={houseInfo["houseType"] || ""}
              />
            </FormGroup>

            <FormGroup>
              <Label for="MaxPerson">Person</Label>

              <Input
                onChange={changeForm}
                name="maxPerson"
                id="maxPerson"
                placeholder="input max person"
                value={houseInfo["maxPerson"] || ""}
              />
            </FormGroup>

            <FormGroup>
              <Label for="Rooms">Rooms</Label>

              <Input
                onChange={changeForm}
                name="rooms"
                id="rooms"
                placeholder="input rooms"
                value={houseInfo["rooms"] || ""}
              />
            </FormGroup>

            <FormGroup>
              <Label for="StartDate">Reservation Start Date</Label>
              <Input
                onChange={changeForm}
                type="date"
                name="startDate"
                id="startDate"
                placeholder="input startdate"
                value={houseInfo["startDate"] || ""}
              />
            </FormGroup>

            <FormGroup>
              <Label for="EndDate">Reservation End Date</Label>
              <Input
                onChange={changeForm}
                type="date"
                name="endDate"
                id="endDate"
                placeholder="input end date"
                value={houseInfo["endDate"] || ""}
              />
            </FormGroup>
            <br />
            <br />
            <FormGroup>
              <div className="mainHouseImg">
                {imgData.mainUrl && (
                  <img
                    src={imgData.mainUrl}
                    alt="메인이미지"
                    width="50%"
                    height="30%"
                  />
                )}
              </div>

              <Label for="MainImage">Main Image</Label>

              <Input
                type="file"
                name="mainImage"
                id="mainImage"
                onChange={onMainImgChange}
              />

              <br />
            </FormGroup>
            <br />
            <br />
            <div className="detailHouseImg">
              {imgData.resultUrl.length >= 4 ? (
                <span className="leftDetail" onClick={onClickLetfDetail}>
                  {" "}
                  <BsCaretLeftFill />{" "}
                </span>
              ) : (
                ""
              )}

              <ul className="detailHouse">
                {imgData.resultUrl.map((file, index) =>
                  index < 3 ? (
                    <li key={index}>
                      <img
                        key={index}
                        src={file}
                        alt="."
                        width="100px"
                        height="100px"
                      />
                    </li>
                  ) : (
                    ""
                  )
                )}
              </ul>
              {imgData.resultUrl.length >= 4 ? (
                <span className="rightDetail" onClick={onClickRightDetail}>
                  {" "}
                  <BsCaretRightFill />{" "}
                </span>
              ) : (
                ""
              )}
            </div>
            <FormGroup>
              <Label for="DetailImage">Detail Image</Label>

              <Input
                type="file"
                name="detailImage"
                id="detailImage"
                onChange={onDetailImgChange}
                accept="image/jpg,image/png,image/jpeg,image/gif"
                multiple
              />
            </FormGroup>

            {match.params.type === "0" ? (
              <Button color="secondary" size="lg" block>
                수정
              </Button>
            ) : (
              match.params.type === "2" && (
                <Button color="secondary" size="lg" block>
                  수정 후 재심사
                </Button>
              )
            )}
          </Form>
        </div>
      </div>
      <div>
        <Modal isOpen={modal} toggle={toggle} className={className}>
          <div>
            <DaumPostcode
              onComplete={inputKaKaoMap}
              style={postCodeStyle}
              height={400}
              autoClose={true}
            />
          </div>
        </Modal>
      </div>
    </>
  );
};
export default HouseUpdate;
