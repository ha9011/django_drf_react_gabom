import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAppContext } from "store.js";

const LoginRequiredRoute = ({ component: Component, ...kwargs }) => {
  console.log("Component : ", Component);
  console.log("kwargs : ", kwargs);

  const {
    store: { isAuthenticated },
  } = useAppContext();

  console.log("isAuthenticated : ", isAuthenticated);
  if (isAuthenticated) {
  } else {
  }

  return (
    <Route
      {...kwargs}
      render={(props) => {
        if (isAuthenticated) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/accounts/login",
                state: { from: props.location },
              }}
            />
          );
          // state from값에 접근해야함(로그인할때 자동이동) -> 로그인.js ㄱㄱ
        }
      }}
    />
  );
};

export default LoginRequiredRoute;
