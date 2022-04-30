import Container from "@material-ui/core/Container";
import "bootstrap/dist/css/bootstrap.min.css";

import AppRouter from "./Router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./app.css";

function App() {
  return (
    <div className={"app"}>
      <Header />
      <Container>
        <AppRouter />
        <div style={{bottom:"30px"}} />
        <div className={"empty-content"} />
      </Container>
      <Footer />
    </div>
  );
}

export default App;
