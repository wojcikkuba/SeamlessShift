import React, { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Nav } from "reactstrap";
import PerfectScrollbar from "perfect-scrollbar";
import logo from "logo_cs_dark.png";

var ps;

function Sidebar(props) {
  const sidebar = useRef();
  const location = useLocation();

  // Function to determine if a route is active
  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };

  useEffect(() => {
    const isWindows = /Win/i.test(navigator.userAgent);

    if (isWindows) {
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }

    return function cleanup() {
      if (isWindows) {
        ps.destroy();
      }
    };
  }, []);

  return (
    <div className="sidebar" data-color={props.backgroundColor}>
      <div className="logo">
        <a className="simple-text logo-normal">
          <div className="logo-img">
            <img src={logo} alt="react-logo" />
          </div>
        </a>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav>
          {props.routes.map((prop, key) => {
            if (prop.redirect) return null;
            return (
              <li
                className={
                  activeRoute(prop.layout + prop.path) +
                  (prop.pro ? " active active-pro" : "")
                }
                key={key}
              >
                <NavLink to={prop.layout + prop.path} className="nav-link">
                  <i className={"now-ui-icons " + prop.icon} />
                  <p>{prop.name}</p>
                </NavLink>
              </li>
            );
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
