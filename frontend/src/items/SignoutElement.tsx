import React from 'react';
import useAuth from "../hooks/useAuth";

const SignoutElement = () => {
  const { logout } = useAuth();

  return (
    <span onClick={logout}>
      <i className="fa fa-sign-out"></i> Sign out
    </span>
  );
};

export default SignoutElement;
