import React from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/user.actions";

function Header() {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Container>
        <Navbar collapseOnSelect bg="light" expand="md">
          <Navbar.Brand href="/">Barmer</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/shops">Shops</Nav.Link>
              <Nav.Link href="/items">Items</Nav.Link>
              {userInfo ? (
                <NavDropdown
                  title={userInfo.username}
                  id="collasible-nav-dropdown"
                >
                  <NavDropdown.Item href="/account">Account</NavDropdown.Item>
                  <NavDropdown.Item href="/history">
                    Barmer History
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/favorites">
                    Favorites
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/requestsmade">
                    Requests Made
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/requestreceived">
                    Request Received
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  {userInfo.isAdmin && (
                    <>
                      <NavDropdown.Item href="/admin/userlist">
                        Users
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/admin/dispatchlist">
                        Dispatch
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/admin/carousels">
                        Carousels
                      </NavDropdown.Item>
                    </>
                  )}
                </NavDropdown>
              ) : (
                <Nav.Link href="/login">
                  <i className="fas fa-user"></i>Sign In
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </header>
  );
}

export default Header;
