import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
} from "reactstrap";

import AuthService from "services/AuthService";

function DemoNavbar(props) {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [color, setColor] = React.useState("transparent");
  const sidebarToggle = React.useRef();

  const toggle = () => {
    if (isOpen) {
      setColor("transparent");
    } else {
      setColor("white");
    }
    setIsOpen(!isOpen);
  };

  const dropdownToggle = (e) => {
    setDropdownOpen(!dropdownOpen);
  };

  const openSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    sidebarToggle.current.classList.toggle("toggled");
  };

  const updateColor = () => {
    if (window.innerWidth < 993 && isOpen) {
      setColor("white");
    } else {
      setColor("transparent");
    }
  };

  const handleLogoutClick = () => {
    AuthService.logout()
      .then((user) => {
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Logout error", error);
      });
  };

  React.useEffect(() => {
    window.addEventListener("resize", updateColor);
  }, []);

  React.useEffect(() => {
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      sidebarToggle.current.classList.toggle("toggled");
    }
  }, [location]);

  return (
    <Navbar
      color={color}
      expand="lg"
      className={`navbar-absolute fixed-top ${
        color === "transparent" ? "navbar-transparent" : ""
      }`}
    >
      <Container fluid>
        <div className="navbar-wrapper">
          <div className="navbar-toggle">
            <button
              type="button"
              ref={sidebarToggle}
              className="navbar-toggler"
              onClick={() => openSidebar()}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
        </div>
        <NavbarToggler onClick={toggle}>
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
        </NavbarToggler>
        <Collapse isOpen={isOpen} navbar className="justify-content-end">
          <Nav navbar>
            <Dropdown
              nav
              isOpen={dropdownOpen}
              toggle={(e) => dropdownToggle(e)}
            >
              <DropdownToggle caret nav>
                <i className="now-ui-icons users_single-02" />
                <p>
                  <span className="d-lg-none d-md-block">Konto</span>
                </p>
              </DropdownToggle>

              <DropdownMenu right>
                <DropdownItem
                  tag={Link}
                  to={`${AuthService.isAdmin() ? "/admin" : "/user"}/user-page`}
                >
                  Moje konto
                </DropdownItem>
                <DropdownItem
                  tag={Link}
                  to="/login"
                  className="logout-button"
                  onClick={handleLogoutClick}
                >
                  Wyloguj
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default DemoNavbar;
