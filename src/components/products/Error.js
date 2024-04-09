import logo from "../../assets/amazon-logo.png";
import { Link } from "react-router-dom";

const Error = ({ error }) => {
  return (
    <>
      <header className="header">
        <div className="main-header-container">
          <div className="logo-container">
            <img src={logo} alt="logo" className="logo" />
          </div>
        </div>
      </header>
      <main>
        <div className="main-container main-error-container">
          <p className="error">Error: {error || "Something went wrong"}!</p>
          <Link to="/auth" className="login-link">
            Got to Login
          </Link>
        </div>
      </main>
    </>
  );
};

export default Error;
