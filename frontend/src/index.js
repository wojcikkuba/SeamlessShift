import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AuthService from "./services/AuthService";
import SignIn from "views/SignIn";
import AddUser from "views/AddUser";
import EditUser from "views/EditUser";
import AddSubject from "views/AddSubject";
import EditSubject from "views/EditSubject";
import ChangePassword from "views/ChangePassword";
import RestorePassword from './views/RestorePassword';


import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/now-ui-dashboard.scss?v1.5.0";
import "assets/css/demo.css";

import AdminLayout from "layouts/Admin.js";
import UserLayout from "layouts/User.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

const AuthRoute = ({ children, adminOnly }) => {
  const isAuthenticated = AuthService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

const PrivateRoute = ({ children, adminOnly }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const isAdmin = AuthService.isAdmin();
  const isPasswordChangeRequired = AuthService.isPasswordChangeRequired();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isPasswordChangeRequired) {
    return <Navigate to="/change-password" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/user/current-requests" />;
  }

  return children;
};

root.render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/login"
        element={
          AuthService.isAuthenticated() ? (
            <Navigate
              to={
                AuthService.isAdmin()
                  ? "/admin/current-requests"
                  : "/user/current-requests"
              }
              replace
            />
          ) : (
            <SignIn />
          )
        }
      />

      <Route
        path="/admin/*"
        element={
          <PrivateRoute adminOnly={true}>
            <AdminLayout />
          </PrivateRoute>
        }
      />
      <Route
        path="/user/*"
        element={
          <PrivateRoute adminOnly={false}>
            <UserLayout />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/add-user"
        element={
          <PrivateRoute adminOnly={true}>
            <AddUser />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/add-subject"
        element={
          <PrivateRoute adminOnly={true}>
            <AddSubject />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/edit-user/:userId"
        element={
          <PrivateRoute adminOnly={true}>
            <EditUser />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/edit-subject/:subjectId"
        element={
          <PrivateRoute adminOnly={true}>
            <EditSubject />
          </PrivateRoute>
        }
      />
      <Route
        path="*"
        element={
          <Navigate
            to={
              AuthService.isAdmin()
                ? "/admin/current-requests"
                : "/user/current-requests"
            }
            replace
          />
        }
      />

      <Route
        path="/change-password"
        element={
          <AuthRoute adminOnly={false}>
            <ChangePassword />
          </AuthRoute>
        }
      />
      <Route path="/restore-password" element={<RestorePassword />} />
    </Routes>
  </BrowserRouter>
);
