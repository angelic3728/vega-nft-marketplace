import React from "react";
import { Redirect } from "@reach/router";

function PrivateRoute({ comp, isAuthenticated, path }) {
  return (
    isAuthenticated ? comp : <Redirect from={path} to="/" />
  );
}

export default PrivateRoute;
