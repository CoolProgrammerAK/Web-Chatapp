import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavLink,
  NavbarBrand,
  Nav,
  NavItem,
} from "reactstrap";
function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand tag={Link} to="/" className="px-2">
         TimeChat
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml" navbar>
            <NavItem>
              {" "}
              <NavLink tag={Link} to="/roomChat">
                RoomChat
              </NavLink>
            </NavItem>
            <NavItem>
              {" "}
              <NavLink tag={Link} to="/liveVisitors">
                Live Visitors
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Header;
