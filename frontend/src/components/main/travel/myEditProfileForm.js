import React, { useState, useRef, useEffect } from "react";
import {
  CardImg,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Tooltip,
} from "reactstrap";
import { useAppContext } from "store";
import "./myEditProfileForm.scss";
import Axios from "axios";
const MyEditProfileForm = ({ myInfo, editToggle, setMyinfo }) => {
  const { store } = useAppContext();
  const inputRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [imgData, setImgData] = useState({ resultUrl: [], mainUrl: "" });
  const toggle = () => setTooltipOpen(!tooltipOpen);

  useEffect(() => {
    setImgData();

    setFormData((prev) => ({
      ...prev,
      avatar: null,
      introduce: myInfo.introduce,
      name: myInfo.user.name,
      phone_number: myInfo.user.phone_number,
      img: "0",
    }));
    setImgData((prev) => ({
      ...prev,
      mainUrl: `http://localhost:8000${myInfo.avatar}`,
    }));
  }, []);
  const openTooltip = () => {
    toggle();
  };
  const imgClick = () => {
    inputRef.current.click();

    toggle();
  };

  const imgBasicClick = () => {
    //`http://localhost:8000${myInfo.avatar}`
    setFormData((prev) => ({
      ...prev,
      img: "1",
    }));

    setImgData((prev) => ({
      ...prev,
      mainUrl: "http://localhost:8000/media/public/basic.JPG",
    }));
    toggle();
  };

  //메인 이미지 변경 할 때
  const onMainImgChange = (e) => {
    const { name, files } = e.target;
    console.log("name : ", name);
    console.log("files[0] : ", files[0]);
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
      img: "2",
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

  const onChangeinput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitEditProfile = (e) => {
    e.preventDefault();
    console.log("-formData-");
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

    async function fn() {
      const config = {
        headers: {
          Authorization: `JWT ${store.jwtToken}`,
        },
      };
      try {
        let response = await Axios.patch(
          "http://localhost:8000/accounts/userprofile/",
          aFormData,
          config
        );

        console.log(response.data);

        const newAvatar = response.data.avatar;
        const newIntroduce = response.data.introduce;
        const newName = response.data.name;
        const newPhone_number = response.data.phone_number;

        console.log(newAvatar);
        console.log(newIntroduce);
        console.log(newName);
        console.log(newPhone_number);
        if (response.data.hasOwnProperty("avatar")) {
          setMyinfo((prev) => ({
            ...prev,
            avatar: newAvatar,
            introduce: newIntroduce,
            user: {
              ...prev.user,
              name: newName,
              phone_number: newPhone_number,
            },
          }));
        } else {
          setMyinfo((prev) => ({
            ...prev,

            introduce: newIntroduce,
            user: {
              ...prev.user,
              name: newName,
              phone_number: newPhone_number,
            },
          }));
        }
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
  return (
    <div>
      <div>
        {imgData.mainUrl && (
          <>
            <img
              onClick={openTooltip}
              className="myImgCardEdit "
              src={imgData.mainUrl || ""}
              alt="Card cap"
              id={"Tooltip-1"}
            />

            <Tooltip
              style={{
                backgroundColor: "white",

                border: "1px solid black",
              }}
              className="Tooltip"
              placement={"right"}
              isOpen={tooltipOpen}
              target={"Tooltip-1"}
            >
              <Button
                onClick={imgBasicClick}
                outline
                color="secondary"
                className="profileImgBtn"
              >
                기본이미지
              </Button>
              <Button
                onClick={imgClick}
                outline
                color="secondary"
                className="profileImgBtn"
              >
                이미지변경
              </Button>
            </Tooltip>
          </>
        )}
      </div>
      <br />
      <br />
      <form onSubmit={onSubmitEditProfile}>
        <FormGroup row>
          <Label for="Name" sm={2}>
            Name
          </Label>
          <Col sm={9}>
            <Input
              onChange={onChangeinput}
              type="text"
              name="name"
              id="name"
              value={formData.name || ""}
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="Phone" sm={2}>
            Phone
          </Label>
          <Col sm={9}>
            <Input
              onChange={onChangeinput}
              type="text"
              name="phone_number"
              id="phone_number"
              placeholder="('-')제외한 숫자 11자리"
              value={formData.phone_number || ""}
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="Introduce" sm={2}>
            Introduce
          </Label>
          <Col sm={9}>
            <Input
              onChange={onChangeinput}
              type="textarea"
              name="introduce"
              id="introduce"
              value={formData.introduce || ""}
            />
          </Col>
        </FormGroup>
        <Input
          style={{
            display: "none",
          }}
          className="profileInput"
          onChange={onMainImgChange}
          innerRef={inputRef}
          type="file"
          name="avatar"
          id="avatar"
        />
        <br />
        <hr />
        <div className="profileModalBtns">
          <Button type="submit" outline color="primary">
            change
          </Button>
          <Button type="button" outline color="primary" onClick={editToggle}>
            close
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MyEditProfileForm;
