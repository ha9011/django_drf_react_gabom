import React, { useState, useEffect } from "react";
import {
  UncontrolledCollapse,
  Button,
  CardBody,
  Card,
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Badge,
} from "reactstrap";
import classnames from "classnames";
import "./travelMyPlan.scss";
import { useAppContext } from "store";
import Axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TravelMyPlanList from "./travelMyPlanList";
import PlanMember from "./planMember";
import { useHistory } from "react-router-dom";
import ShareModal from "./shareModal";
import ShareScoreModal from "./shareScoreModal";

const TravelMyPlan = () => {
  let history = useHistory();
  const [makePlanList, setMakePlanList] = useState([]);
  const [invitedPlanList, setInvitedPlanList] = useState([]);
  const [makePlan, setMakePlan] = useState({ complete: "1" });
  const [sDate, setSDate] = useState(new Date());
  const [eDate, setEDate] = useState(new Date());
  const { store } = useAppContext();

  // 공유 모달 설정
  const [modal, setModal] = useState(false);

  const shareToggle = () => {
    setModal(!modal);
  };

  // tab 설정
  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  // 맴버 리스트 창
  const [showMember, setShowMember] = useState(false);
  const [clickPlanTitle, setClickPlanTitle] = useState();
  const [memberList, setMemberList] = useState([]);

  // 선택된 여행No
  const [choicePlanNo, setChoicePlanNo] = useState("");

  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  console.log("....................");
  console.log(config);
  console.log(store);

  useEffect(() => {
    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          "http://localhost:8000/plans/makeplan/",
          config
        );
        console.log("메인 여행 리스트11");
        console.log(response);
        setMakePlanList(makePlanList.concat(response.data.myPlan));
        setInvitedPlanList(response.data.invitedPlan);
      } catch (error) {
        alert("플랜불러오기 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();

    let date = new Date();
    let year = date.getFullYear(); // 년도
    let month; // 월
    month =
      String(date.getMonth() + 1).length === 1
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    let day = date.getDate(); // 날짜

    setMakePlan((prev) => ({
      ...prev,
      start_date: year + "-" + month + "-" + day,
    }));
  }, []);

  // input 값 변경
  const onChangeMakePlan = (e) => {
    const { name, value } = e.target;
    setMakePlan((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // input - select  값 변경
  const onChangeMakePlanSelect = (e) => {
    console.log(e.target);
    console.dir(e.target);
    const { value, selectedIndex } = e.target;
    const { innerText } = e.target[selectedIndex];
    console.log(innerText);
    setMakePlan((prev) => ({
      ...prev,
      location: innerText,
      areacode: value,
    }));
  };
  // 여행 시작날짜 변경
  const onChangeSDate = (e) => {
    let date = new Date(e);
    let year = date.getFullYear(); // 년도
    let month; // 월
    month =
      String(date.getMonth() + 1).length === 1
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    let day = date.getDate(); // 날짜
    let resultDay = year + "-" + month + "-" + day;
    setMakePlan((prev) => ({
      ...prev,
      start_date: resultDay,
    }));

    setSDate(e);

    setMakePlan((prev) => ({
      ...prev,
      schedule: getDateRangeData(e, eDate),
    }));
  };
  // 여행 마지막날짜 변경
  const onChangeEDate = (e) => {
    let date = new Date(e);
    let year = date.getFullYear(); // 년도
    let month; // 월
    month =
      String(date.getMonth() + 1).length === 1
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    let day = date.getDate(); // 날짜
    let resultDay = year + "-" + month + "-" + day;
    setMakePlan((prev) => ({
      ...prev,
      end_date: resultDay,
    }));
    setEDate(e);

    setMakePlan((prev) => ({
      ...prev,
      schedule: getDateRangeData(sDate, e),
    }));
  };

  // 여행만들기
  const onSubmitMakePlan = (e) => {
    e.preventDefault();
    console.log(makePlan);
    console.log(sDate);
    console.log(eDate);

    async function fn() {
      console.log("만들어질떄 data");
      console.log(makePlan);
      try {
        // 스케줄 오브젝트 생성

        console.log("=====================1");
        console.log(makePlan);
        // 전송
        let response = await Axios.post(
          "http://localhost:8000/plans/makeplan/",
          makePlan,
          config
        );

        console.log("=====================1-1");
        console.log(response.data);
        setMakePlanList(makePlanList.concat(response.data));
        console.log(makePlanList);
        alert("새로운 여행이 생성되었습니다.");
      } catch (error) {
        alert("여행만들기 실패");
        console.log("=====================2");
        console.log(makePlan);
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  };

  // 텝 클릭스, member창 초기화
  const clickChangeTab = () => {
    setShowMember(false);
  };

  // 여행입장
  const clickTravelPlanEnter = () => {
    history.push(`/index/main/travel/${choicePlanNo}`);

    setShowMember(false);
  };

  // 여행 초대 승낙
  const clickTravelPlanAgree = () => {
    async function fn() {
      try {
        let response = await Axios.get(
          `http://localhost:8000/plans/agreeplan/${choicePlanNo}`,
          config
        );

        console.log("플랜 가입 요청 승인");
        console.log(response.data);
        // 1.요청된 여행 리스트에서 삭제
        setInvitedPlanList(
          invitedPlanList.filter((info) => info.plan.id !== choicePlanNo)
        );
        // 2. 나의 여행 리스트에 추가
        setMakePlanList(makePlanList.concat(response.data));
        // 3. 맴버 초기화
        setShowMember(false);
      } catch (error) {
        alert("플랜 가입 요청 승인 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  };

  // 여행초대 거절
  const clickTravelPlanReject = () => {
    async function fn() {
      try {
        let response = await Axios.get(
          `http://localhost:8000/plans/rejectplan/${choicePlanNo}`,

          config
        );

        console.log("플랜 가입 요청 거절");

        // 1.요청된 여행 리스트에서 삭제
        setInvitedPlanList(
          invitedPlanList.filter((info) => info.plan.id !== choicePlanNo)
        );

        // 2. 맴버 초기화
        setShowMember(false);
      } catch (error) {
        alert("맴버초대 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  };
  return (
    <>
      <div className="myPlanMain">
        <div className="myPlanMake">
          <Button
            color="primary"
            className="toggler"
            style={{ marginBottom: "1rem" }}
          >
            여행계획하기
          </Button>
          <Button
            color="primary"
            style={{ marginBottom: "1rem" }}
            onClick={shareToggle}
          >
            여행공유받기
          </Button>
          <UncontrolledCollapse toggler=".toggler">
            <Card>
              <CardBody>
                <Form onSubmit={onSubmitMakePlan}>
                  <Row form>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="exampleCity">Travel Title</Label>
                        <Input
                          onChange={onChangeMakePlan}
                          type="text"
                          name="plan_title"
                          id="plan_title"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="exampleCity">Location</Label>

                        <Input
                          onChange={onChangeMakePlanSelect}
                          type="select"
                          name="location"
                          id="location"
                        >
                          <option value="1">서울</option>
                          <option value="2">인천</option>
                          <option value="3">대전</option>
                          <option value="4">대구</option>
                          <option value="5">광주</option>
                          <option value="6">부산</option>
                          <option value="7">울산</option>
                          <option value="8">세종</option>
                          <option value="31">경기도</option>
                          <option value="32">강원도</option>
                          <option value="33">충청북도</option>
                          <option value="34">충청남도</option>
                          <option value="35">경상북도</option>
                          <option value="36">경상남도</option>
                          <option value="37">전라북도</option>
                          <option value="38">전라남도</option>
                          <option value="39">제주도</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label for="exampleState">Start Date</Label>
                        <br />
                        <DatePicker
                          minDate={new Date()}
                          selected={sDate}
                          onChange={(date) => onChangeSDate(date)}
                          selectsStart
                          startDate={sDate}
                          endDate={eDate}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label for="exampleZip">Last Date</Label>
                        <br />
                        <DatePicker
                          selected={eDate}
                          onChange={(date) => onChangeEDate(date)}
                          selectsEnd
                          startDate={sDate}
                          endDate={eDate}
                          minDate={sDate}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <Button className="toggler" onClick={onSubmitMakePlan}>
                        Sign in
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </UncontrolledCollapse>
        </div>
        <div className="myPlanListContainer">
          <div>
            <Nav tabs>
              <NavItem className="planListTab " onClick={clickChangeTab}>
                <NavLink
                  className={classnames({ activePlanList: activeTab === "1" })}
                  onClick={() => {
                    toggle("1");
                  }}
                >
                  나의 여행 리스트
                </NavLink>
              </NavItem>
              <NavItem className="planListTab " onClick={clickChangeTab}>
                <NavLink
                  className={classnames({ activePlanList: activeTab === "2" })}
                  onClick={() => {
                    toggle("2");
                  }}
                >
                  {invitedPlanList.length === 0 ? (
                    ""
                  ) : (
                    <Badge color="secondary">NEW</Badge>
                  )}
                  초대 받은 여행 리스트{" "}
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab} className="planListContent">
              <TabPane tabId="1">
                <Row>
                  <Col>
                    {makePlanList.map((item, idx) => (
                      <TravelMyPlanList
                        number={idx + 1}
                        key={item.plan.id}
                        id={item.plan.id}
                        basicInfo={item.plan}
                        setClickPlanTitle={setClickPlanTitle}
                        showMember={showMember}
                        setShowMember={setShowMember}
                        memberList={memberList}
                        setMemberList={setMemberList}
                        setChoicePlanNo={setChoicePlanNo}
                      />
                    ))}
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Col>
                    {invitedPlanList.map((item, idx) => (
                      <TravelMyPlanList
                        number={idx + 1}
                        key={item.plan.id}
                        id={item.plan.id}
                        basicInfo={item.plan}
                        setClickPlanTitle={setClickPlanTitle}
                        showMember={showMember}
                        setShowMember={setShowMember}
                        memberList={memberList}
                        setMemberList={setMemberList}
                        setChoicePlanNo={setChoicePlanNo}
                      />
                    ))}
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </div>

          {showMember && (
            <div>
              <div className="memberInPlan">
                <Nav tabs>
                  <NavItem className="memberInPlanTitle ">
                    <NavLink> {clickPlanTitle}의 여행 맴버</NavLink>
                  </NavItem>
                </Nav>
              </div>
              <div className="memberContainer">
                {memberList.map((item1, idx) => (
                  <PlanMember
                    key={item1.user.pk}
                    id={item1.user.pk}
                    basicInfo={item1}
                  />
                ))}
              </div>
              <div className="planBtns">
                {activeTab === "1" ? (
                  <Button onClick={clickTravelPlanEnter}>입장</Button>
                ) : (
                  <>
                    <Button onClick={clickTravelPlanAgree}>참여</Button>
                    <Button onClick={clickTravelPlanReject}>거절</Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* 공유 모달 */}
      <div>
        <ShareModal
          shareToggle={shareToggle}
          modal={modal}
          makePlanList={makePlanList}
          setMakePlanList={setMakePlanList}
        />
      </div>
    </>
  );
};

function getDateRangeData(param1, param2) {
  console.log("==getDateRangeData==");
  console.log("시작 : " + param1);
  console.log("끝 : " + param2);
  //param1은 시작일, param2는 종료일이다.
  let res_day = [];
  let ss_day = new Date(param1);
  let ee_day = new Date(param2);
  let nth = 1;
  while (ss_day.getTime() <= ee_day.getTime()) {
    let obj = {};
    let _mon_ = ss_day.getMonth() + 1;
    _mon_ = _mon_ < 10 ? "0" + _mon_ : _mon_;
    let _day_ = ss_day.getDate();
    _day_ = _day_ < 10 ? "0" + _day_ : _day_;

    obj["date"] = ss_day.getFullYear() + "-" + _mon_ + "-" + _day_;
    obj["nth_day"] = nth;

    nth++;
    res_day.push(obj);

    ss_day.setDate(ss_day.getDate() + 1);
  }
  return res_day;
}

export default TravelMyPlan;
