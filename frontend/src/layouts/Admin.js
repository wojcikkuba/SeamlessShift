import React, { useEffect, useRef, useState } from "react";
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import routes from "routes/admin.js";

let ps;

function Admin(props) {
  const location = useLocation();
  const mainPanel = useRef();

  useEffect(() => {
    const isWindows = navigator.userAgent.includes("Windows");

    if (isWindows) {
      ps = new PerfectScrollbar(mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on");
    }

    return () => {
      if (isWindows) {
        ps.destroy();
        document.body.classList.toggle("perfect-scrollbar-on");
      }
    };
  }, []);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;
  }, [location]);

  return (
    <div className="wrapper">
      <Sidebar {...props} routes={routes} backgroundColor="blue" />
      <div className="main-panel" ref={mainPanel}>
        <DemoNavbar {...props} />
        <Routes>
          {routes.map((prop, key) => (
            <Route path={prop.path} element={prop.component} key={key} />
          ))}
          <Route
            path="/admin"
            element={<Navigate to="/admin/current-requests" replace />}
          />
        </Routes>
        <Footer fluid />
      </div>
    </div>
  );
}

export default Admin;
