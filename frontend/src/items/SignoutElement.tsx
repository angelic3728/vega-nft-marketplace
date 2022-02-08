import useAuth from "../hooks/useAuth";

const SignoutElement = (props) => {
  const { login, logout } = useAuth();

  return (
    <span onClick={logout}>
      <i className="fa fa-sign-out"></i> Sign out
    </span>
  );
};

export default SignoutElement;
