import React from "react";
import { Link } from "react-router-dom";

export default function NavBar({ username, setUsername }) {
  function handleLogOut() {
    fetch("/logout", { method: "DELETE" }).then((r) => {
      if (r.ok) {
        setUsername(null);
      }
    });
  }

  return (
    <div className="header">
      {username ? (
        <ul>
          <Link to="/home" className="nav">
            <li>Home</li>
          </Link>
          <Link to="/profile" className="nav">
            <li>Profile</li>
          </Link>
          <Link to="/login" className="nav" onClick={handleLogOut}>
            <li>Logout</li>
          </Link>
        </ul>
      ) : (
        <ul>
          <Link to="/login" className="nav">
            <li>Login</li>
          </Link>
          <Link to="/signup" className="nav">
            <li>Signup</li>
          </Link>
          <Link to="/home" className="nav">
            <li>Home</li>
          </Link>
        </ul>
      )}
      {username ? (
        <p className="user">
          <span className="welcome">Welcome </span> {username.username}
        </p>
      ) : null}
    </div>
  );
}
