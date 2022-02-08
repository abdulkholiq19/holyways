import React, { useContext, useState, useEffect } from 'react';
import {
  Navbar,
  Container,
  Button,
  NavDropdown
} from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import '../App.css';
import { ModalLogin } from './ModalLoginComponent';
import { ModalRegister } from './ModalRegisterComponent';
import imageIcon from '../images/Ellipse.png';
import userIcon from '../images/icons/user.png';
import raiseFundIcon from '../images/icons/raise-fund.png';
import logoutIcon from '../images/icons/logout.png';
import iconLogo from '../images/icons/Icon.png';
import { UserContext } from '../context/UserContext';

import { API } from "../config/api";

export const NavbarComponent = () => {
  const [modalShowLogin, setModalShowLogin] = useState(false);
  const [modalShowRegister, setModalShowRegister] = useState(false);
  const [state, dispatch] = useContext(UserContext);
  const handleLogout = () => {
    dispatch({
        type: 'LOGOUT'
    })
  }

  return (
    <div>
      <Navbar className="BgPrimary">
        <Container>
          <Navbar.Brand className="mx-5">
            <Link to="/" className="text-light text-decoration-none ml-5">
              <img 
                src={iconLogo} 
                alt="user icon"
              />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          {state.isLogin === false ? 
          <Navbar.Collapse className="justify-content-end mx-5">
            <Navbar.Text className="login-text" >
              <Link to="" className="text-light text-decoration-none" onClick={() => setModalShowLogin(true)}>
                Login
              </Link>
            </Navbar.Text>
            <Button variant="light" className="button-register" onClick={() => setModalShowRegister(true)}>
              Register
            </Button>
          </Navbar.Collapse>
          :
          <NavDropdown
            title={
              <div className="pull-left">
                  <img className="thumbnail-image" 
                      src={imageIcon} 
                      alt="user pic"
                  />
              </div>
          } 
            id="nav-dropdown"
          >
            <Container>
            </Container>
            <NavDropdown.Item eventKey="4.2">
              <Link
                to="/profile"
                className="text-decoration-none text-dark navbar-dropdown-text"
              >
                <img 
                  src={userIcon} 
                  alt="user icon"
                  className="dropdown-icon"
                /> &nbsp;
                Profile
              </Link>
            </NavDropdown.Item>
            <NavDropdown.Item eventKey="4.3" className="mb-3 mt-3">
              <Link
                to="/raise-fund"
                className="text-decoration-none text-dark navbar-dropdown-text"
              >
                <img 
                  src={raiseFundIcon} 
                  alt="user icon"
                  className="dropdown-icon"
                /> &nbsp;
                Raise Fund
              </Link>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item eventKey="4.4">
              <Button
                onClick={handleLogout}
                variant="link"
                to="/"
                className="text-decoration-none text-dark p-0 navbar-dropdown-text"
              >
                <img 
                  src={logoutIcon} 
                  alt="user icon"
                  className="dropdown-icon"
                />&nbsp;&nbsp;
                Logout
              </Button >
            </NavDropdown.Item>
          </NavDropdown>
          }
        </Container>
      </Navbar>
      <ModalLogin
        show={modalShowLogin}
        onHide={() => setModalShowLogin(false)}
      />
      <ModalRegister
        show={modalShowRegister}
        onHide={() => setModalShowRegister(false)}
      />
    </div>
  );
}
