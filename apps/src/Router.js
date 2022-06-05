import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import RegisterCertificate from "./components/RegisterCertificate";
import VerifyCertificate from "./components/VerifyCertificate";
import RegisterIssuer from "./components/RegisterIssuer";
import NotFound from "./components/NotFound";

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render() {
    return (
      <Router>
        <Routes>
          {/* <Route exact path="/" element={<Home />}></Route> */}
          <Route
            exact
            path="/register-cert"
            element={
              <RegisterCertificate
                isLoading={this.props.isLoading}
                setToLoading={this.props.setToLoading}
              />
            }
          ></Route>
          <Route
            exact
            path="/verify-cert"
            element={
              <VerifyCertificate
                isLoading={this.props.isLoading}
                setToLoading={this.props.setToLoading}
              />
            }
          ></Route>
          <Route
            exact
            path="/register-issuer"
            element={
              <RegisterIssuer
                isLoading={this.props.isLoading}
                setToLoading={this.props.setToLoading}
              />
            }
          ></Route>
          <Route path='*' exact={true} element={<NotFound />} ></Route>
        </Routes>
      </Router>
    );
  }
}

export default AppRouter;
