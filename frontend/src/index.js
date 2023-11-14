import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AuthService from './services/AuthService';
import SignIn from "views/SignIn";
import AddUser from "views/AddUser";
import EditUser from "views/EditUser";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/now-ui-dashboard.scss?v1.5.0";
import "assets/css/demo.css";

import AdminLayout from "layouts/Admin.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

const PrivateRoute = ({ children }) => {
  return AuthService.isAuthenticated() ? children : <Navigate to="/login" />;
};

root.render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/login"
        element={AuthService.isAuthenticated() ? <Navigate to="/admin/dashboard" /> : <SignIn />}
      />
      <Route
        path="/admin/*"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      />
      <Route path="/admin/add-user" element={<PrivateRoute><AddUser /></PrivateRoute>} />
      <Route path="/admin/edit-user/:userId" element={<PrivateRoute><EditUser /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  </BrowserRouter>
);
