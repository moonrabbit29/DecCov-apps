import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

import "bootstrap/dist/css/bootstrap.min.css";

export default function Header() {
  const displayDesktop = () => {
    return <Toolbar>{femmecubatorLogo}</Toolbar>;
  };
  const femmecubatorLogo = (
    <Typography variant="h6" component="h1">
      DecCov-App
    </Typography>
  );

  return (
    <header>
      <AppBar>{displayDesktop()}</AppBar>
      <Toolbar />
      <Toolbar />
    </header>
  );
}
