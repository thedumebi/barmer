import React from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";

function NavBar({ user }) {
  return (
    <div className="navbar-fixed">
      <Container>
        <Navbar collapseOnSelect bg="light" expand="md">
          <Navbar.Brand href="/">Jumga</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/shops">Shops</Nav.Link>
              <Nav.Link href="/items">Items</Nav.Link>
              <NavDropdown title="Profile" id="collasible-nav-dropdown">
                {user && (
                  <div>
                    <NavDropdown.Item href="/account">Account</NavDropdown.Item>
                    <NavDropdown.Item href="/history">
                      Purchase History
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/favorites">
                      Favorites
                    </NavDropdown.Item>
                  </div>
                )}
                <NavDropdown.Divider />
                {user ? (
                  <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                ) : (
                  <NavDropdown.Item href="/login">Login</NavDropdown.Item>
                )}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </div>
  );
}

export default NavBar;
