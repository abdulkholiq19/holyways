import React, { useContext } from 'react';
import { Redirect, Route } from "react-router-dom";
import { UserContext } from '../context/UserContext.js';

export function PrivateRoute({component : Component, ...rest}) {
  const [state, _] = useContext(UserContext);

  return(
    <>
      <Route 
        {...rest}
        render={(props) => (
          state.isLogin ? <Component {...props} /> : <Redirect to="/"/>
          )}
      />
    </>
  )
  
}