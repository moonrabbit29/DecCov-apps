import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home"
import RegisterCertificate from "./components/RegisterCertificate"
import VerifyCertificate from "./components/VerifyCertificate"

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route
          exact
          path="/register-cert"
          element={<RegisterCertificate />}
        ></Route>
        <Route
          exact
          path="/verify-cert"
          element={<VerifyCertificate />}
        ></Route>
      </Routes>
    </Router>
  );
}
