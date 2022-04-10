import { 
  BrowserRouter as Router, 
  Routes, 
  Route
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from "./components/Home";
import RegisterCertificate from './components/RegisterCertificate'

function App() {
  return (
    <div style={{padding:"0px 10px", margin:"5px"}}>
        
        <Router>
        <Routes>
          <Route exact path='/' element={< Home />}></Route>
          <Route exact path='/register-cert' element={<RegisterCertificate />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
