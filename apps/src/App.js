import Container from "@material-ui/core/Container";
import React, { useState, useEffect } from "react";
import LoadingOverlay from "react-loading-overlay";
import "bootstrap/dist/css/bootstrap.min.css";
import AppRouter from "./Router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./app.css";

function App () {
  const [isLoading,setIsLoading ]= useState(false)
  const setToLoading = (status) => {
   // console.log(`status -> ${status}`)
    setIsLoading(status);
  };
  const[loadingMessage,setLoadingMessage]=useState("Please login to your metamask...")
  const setLoadingText = (message)=>{
    setLoadingMessage(message)
  } 
  return (
      <LoadingOverlay
        active={isLoading}
        spinner
        text={loadingMessage}
      >
        <div className={"app"}>
          <Header />
          <Container>
            <AppRouter
              isLoading={isLoading}
              setToLoading={setToLoading}
              setLoadingText={setLoadingText}
            />
            <div style={{ bottom: "30px" }} />
            <div className={"empty-content"} />
          </Container>
          <Footer />
        </div>
      </LoadingOverlay>
    );
}

export default App;
