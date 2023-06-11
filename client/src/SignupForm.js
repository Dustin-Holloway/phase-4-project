import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";

function SignUpForm() {
  const history = useHistory();
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    passwordConfirmation: "",
    name: "",
    image: "",
    unit: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (userData.password !== userData.passwordConfirmation) {
      setErrorMessage("Passwords do not match !");
      return;
    } else {
      fetch("/new_user", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
          name: userData.name,
          image: userData.image,
          unit: userData.unit,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
      history.push("/login");
    }
    // Clear the error message if the validation passes
    setUserData({
      username: "",
      password: "",
      passwordConfirmation: "",
      name: "",
      image: "",
      unit: "",
    });
    setErrorMessage("");
  }

  return (
    <div>
      <form className="userForm" onSubmit={handleSubmit}>
        {/* <label htmlFor="username">Username</label> */}
        <input
          type="text"
          id="username"
          placeholder="Username"
          autoComplete="off"
          name="username"
          value={userData.username}
          onChange={(e) =>
            setUserData({ ...userData, [e.target.name]: e.target.value })
          }
        />
        {/* <label htmlFor="password">Password</label> */}
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={userData.password}
          name="password"
          onChange={(e) =>
            setUserData({ ...userData, [e.target.name]: e.target.value })
          }
          autoComplete="current-password"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          id="password_confirmation"
          value={userData.passwordConfirmation}
          onChange={(e) =>
            setUserData({ ...userData, [e.target.name]: e.target.value })
          }
          name="passwordConfirmation"
          autoComplete="current-password"
        />
        {/* <label htmlFor="imageUrl">Profile Image</label> */}
        {/* <input
          placeholder="Password"
          type="text"
          name="image"
          id="imageUrl"
          value={userData.image}
          onChange={(e) =>
            setUserData({ ...userData, [e.target.name]: e.target.value })
          }
        /> */}

        <input
          placeholder="Unit #"
          id="unit"
          type="text"
          name="unit"
          value={userData.unit}
          onChange={(e) =>
            setUserData({ ...userData, [e.target.name]: e.target.value })
          }
        />
        {errorMessage && <p>{errorMessage}</p>}
        <button>Submit</button>
      </form>
    </div>
  );
}

export default SignUpForm;
