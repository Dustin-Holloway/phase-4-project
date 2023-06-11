import React from "react";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Form({ setUsername }) {
  const history = useHistory();

  const [errorMessage, setErrorMessage] = useState("");

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      fetch("/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setErrorMessage(data.error);
          } else {
            setUsername(data);
            history.push("/home");
          }
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    },
  });

  const styles = {
    color: "red",
  };

  return (
    <div className="formContainer">
      <form className="userForm" onSubmit={formik.handleSubmit}>
        <input
          placeholder="Username"
          value={formik.values.username}
          type="text"
          name="username"
          onChange={formik.handleChange}
        />
        {formik.errors.username && formik.touched.username && (
          <div className="error">{formik.errors.username}</div>
        )}
        <input
          placeholder="Password"
          value={formik.values.password}
          type="password"
          name="password"
          onChange={formik.handleChange}
        />
        {errorMessage && <div className="error">{errorMessage}</div>}

        {formik.errors.password && formik.touched.password && (
          <div className="error">{formik.errors.password}</div>
        )}

        <button type="submit">Submit</button>
        <Link className="links" to="/Signup">
          <h5>Create an Account</h5>
        </Link>
      </form>
    </div>
  );
}
