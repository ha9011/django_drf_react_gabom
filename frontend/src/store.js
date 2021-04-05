import React, { createContext, useContext, useReducer } from "react";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update,
} from "use-reducer-with-side-effects";
import { getStorageItem, setStorageItem } from "utils/useLocalStorage";

const AppContext = createContext(); // default값

// 리듀서는 순수함수로 메모리에만 저장이 되어야함
// html 렌더링이나, 로컬 저장 같은 사이드 이펙트가 없어야한다.
// 허나 우린 로컬에 토큰 값을 저장해야하기에, 사이드이펙트 효과가 필요하다 , 그래서 위에 import 했다
//use-reducer-with-side-effects

//  팁
// 훅은 절대로 콜백 내에서는  훅을 할 수 없다.  주의하자
// 훅은 순서대로 실행되어야한다,  비동기를 위한 콜백은 안됨

// 이게 리덕스(사가) 쓰는 이유
const reducer = (prevState, action) => {
  console.log("==reducer==");
  console.log(action);
  const { type } = action;
  if (type === SET_TOKEN) {
    const { payload: jwtToken } = action;
    const newState = {
      ...prevState,
      jwtToken,
      isAuthenticated: true,
    };

    //1인자 -> state 저장값, 2인자 -> side에 할 함수
    return UpdateWithSideEffect(newState, (state, dispatch) => {
      setStorageItem("jwtToken", jwtToken); // 키 벨류   // 사이드 이펙트를 동작시킬 함수
    });
  } else if (type === DELETE_TOKEN) {
    const newState = {
      ...prevState,
      jwtToken: "",
      isAuthenticated: false,
    };
    return UpdateWithSideEffect(newState, (state, dispatch) => {
      setStorageItem("jwtToken", ""); // 키 벨류   // 사이드 이펙트를 동작시킬 함수
    });
  } else if (type === SET_USERTYPE) {
    console.log("reduce - SET_USERTYPE");
    const { payload: userType } = action;
    const newState = {
      ...prevState,
      userType,
    };
    return UpdateWithSideEffect(newState, (state, dispatch) => {
      setStorageItem("userType", userType); // 키 벨류   // 사이드 이펙트를 동작시킬 함수
    });
  } else if (type === SET_USERIMG) {
    console.log("reduce - SET_USERIMG");
    const { payload: userImg } = action;
    const newState = {
      ...prevState,
      userImg,
    };
    return UpdateWithSideEffect(newState, (state, dispatch) => {
      setStorageItem("userImg", userImg); // 키 벨류   // 사이드 이펙트를 동작시킬 함수
    });
  } else if (type === SET_USERNAME) {
    console.log("reduce - SET_USERNAME");
    const { payload: userName } = action;
    const newState = {
      ...prevState,
      userName,
    };
    return UpdateWithSideEffect(newState, (state, dispatch) => {
      setStorageItem("userName", userName); // 키 벨류   // 사이드 이펙트를 동작시킬 함수
    });
  } else if (type === SET_USERPK) {
    console.log("reduce - SET_USERPK");
    const { payload: userPk } = action;
    const newState = {
      ...prevState,
      userPk,
    };
    return UpdateWithSideEffect(newState, (state, dispatch) => {
      setStorageItem("userPk", userPk); // 키 벨류   // 사이드 이펙트를 동작시킬 함수
    });
  } else if (type === SET_USER_SOCKET) {
    console.log("reduce - SET_USER_SOCKET");
    const { payload: userPk } = action;
    const newState = {
      ...prevState,
      userSocket: new WebSocket(
        "ws://127.0.0.1:8000/ws/chat/main/" + userPk + "/"
      ),
    };

    return UpdateWithSideEffect(newState, (state, dispatch) => {
      setStorageItem(
        "userSocket",
        new WebSocket("ws://127.0.0.1:8000/ws/chat/main/" + userPk + "/")
      ); // 키 벨류   // 사이드 이펙트를 동작시킬 함수
    });
  }

  return prevState;
};

const reducerInfo = (prevState, action) => {
  console.log("==action : ", action);
  const { type } = action;
  if (type === SET_USERTYPE) {
    console.log("reduce - SET_USERTYPE");
    const { payload: userType } = action;
    const newState = {
      ...prevState,
      userType,
    };
    return newState;
  } else if (type === SET_USERIMG) {
    console.log("reduce - SET_USERIMG");
    const { payload: userImg } = action;
    const newState = {
      ...prevState,
      userImg,
    };
    console.log(newState);
    return newState;
  } else if (type === SET_USERNAME) {
    console.log("reduce - SET_USERNAME");
    const { payload: userName } = action;
    const newState = {
      ...prevState,
      userName,
    };
    console.log(newState);
    return newState;
  }

  return prevState;
};

export const AppProvider = ({ children }) => {
  const jwtToken = getStorageItem("jwtToken", ""); // jwtToken이 있으면 가져오고 없으면 ""
  const userType = getStorageItem("userType", "");
  const userImg = getStorageItem("userImg", "");
  const userName = getStorageItem("userName", "");
  const userPk = getStorageItem("userPk", "");

  const [store, dispatch] = useReducerWithSideEffects(reducer, {
    jwtToken,
    isAuthenticated: jwtToken.length > 0,
    userType: userType,
    userImg: userImg,
    userName: userName,
    userPk: userPk,
  });

  const [storeInfo, dispatchInfo] = useReducer(reducerInfo, {
    userType: "",
    userImg: "",
    userName: "",
  });

  return (
    <AppContext.Provider value={{ store, dispatch, storeInfo, dispatchInfo }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

// ACTION

const SET_TOKEN = "APP/SET_TOKEN";
const DELETE_TOKEN = "APP/DELETE_TOKEN";
const SET_USERTYPE = "APP/SET_USERTYPE";
const SET_USERIMG = "APP/SET_USERIMG";
const SET_USERNAME = "APP/SET_USERNAME";
const SET_USERPK = "APP/SET_USERPK";
const SET_USER_SOCKET = "APP/SET_USER_SOCKET";

// ACTION CREATORS

export const setToken = (token) => ({ type: SET_TOKEN, payload: token }); // dispatch(setToken(jwtToken))
export const deleteToken = () => ({ type: DELETE_TOKEN });
export const setUserType = (userType) => ({
  type: SET_USERTYPE,
  payload: userType,
});
export const setUserImg = (userImg) => ({
  type: SET_USERIMG,
  payload: userImg,
});

export const setUserName = (userName) => ({
  type: SET_USERNAME,
  payload: userName,
});

export const setUserPk = (userPk) => ({
  type: SET_USERPK,
  payload: userPk,
});

export const setUserSocket = (userPk) => ({
  type: SET_USER_SOCKET,
  payload: userPk,
});
