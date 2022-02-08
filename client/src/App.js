import React, { useContext, useEffect } from "react";
import { UserContext } from "./context/UserContext";
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";
import Home from "./containers/HomeContainer"
import ProfileContainer from "./containers/ProfileContainer";
import RaiseFundContainer from "./containers/RaiseFundContainer";
import MakeRaiseFundContainer from "./containers/MakeRaiseFundContainer";
import DetailDonateContainer from "./containers/DetailDonateContainer";
import ViewFundContainer from "./containers/ViewFundContainer";
import { NavbarComponent } from './components/NavbarComponent';
import { PrivateRoute } from './components/PrivateRouteComponent';

import { API, setAuthToken } from "./config/api";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  let history = useHistory();
  const [state, dispatch] = useContext(UserContext);
  // console.clear();
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    if (!state.isLogin) {
      history.push("/");
    }

  }, [state]);

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");
      // If the token incorrect
      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      // Get user data
      let payload = response.data.data;
      // Get token from local storage
      payload.user.token = localStorage.token;

      // Send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return(
    <div>
      <Router>
        <NavbarComponent />
        <Switch>
          <Route exact path="/" component={Home}/>
          <PrivateRoute path="/profile" component={ProfileContainer} />
          <PrivateRoute path="/raise-fund" component={RaiseFundContainer} />
          <PrivateRoute path="/make-raise-fund" component={MakeRaiseFundContainer} />
          <PrivateRoute path="/detail-donate/:id" component={DetailDonateContainer} />
          <PrivateRoute path="/view-fund/:id" component={ViewFundContainer} />
        </Switch>
      </Router>
    </div>
  )
}

export default App;