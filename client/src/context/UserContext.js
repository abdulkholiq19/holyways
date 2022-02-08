import { createContext, useReducer } from "react";

export const UserContext = createContext()

const initialState = {
    isLogin: false,
    user: {},
    profile: {},
    dataDonation: {},
    dataFundId: {}
}

const reducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case "USER_SUCCESS":
    case 'LOGIN_SUCCESS':
      localStorage.setItem("token", payload.user.token)
      return {
        isLogin: true,
        user: payload.user
      }
    case 'UPDATE_USER_SUCCESS':
      return {
        isLogin: true,
        user: payload
      }
    case 'UPDATE_PROFILE_SUCCESS':
      return {
        isLogin: true,
        profile: payload
      }
    case 'GET_PROFILE_SUCCESS':
      return {
        isLogin: true,
        profile: payload
      }
    case 'APPROVE_SUCCESS':
    return {
        isLogin: true,
        dataDonation: payload
      }
    case 'GET_FUND_ID_SUCCESS':
    return {
        isLogin: true,
        dataFundId: payload
      }
    case 'REGISTER_SUCCESS':
      return {
        isLogin: true,
        user: payload
      }
    case "AUTH_ERROR":
    case 'LOGOUT':
      localStorage.removeItem("token")
      return {
        isLogin: false,
        user: {},
        profile: {}
      }
    default:
      return state;
  }
}

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <UserContext.Provider value={[state, dispatch]} >
            {children}
        </UserContext.Provider>
    )
}