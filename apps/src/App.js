import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./components/Home";
import RegisterCertificate from "./components/RegisterCertificate";
import VerifyCertificate from "./components/VerifyCertificate";
import Footer from "./components/Footer";
import Header from "./components/Header";
import './app.css';

function App() {
  return (
    <div style={{padding:"0px 0px", margin:"0px"}}>
        <Router>
          <Header />
        <Routes>
          <Route exact path='/' element={< Home />}></Route>
          <Route exact path='/register-cert' element={<RegisterCertificate />}></Route>
          <Route exact path='/verify-cert' element={<VerifyCertificate />}></Route>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
