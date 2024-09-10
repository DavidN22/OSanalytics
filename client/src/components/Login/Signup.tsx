import React, { useState } from "react";
import styles from "./Login.module.css";
import axios from "axios";
import { useAtom } from "jotai";
import { activeUserAtom, backendUrl } from "../../state/Atoms";
import Navbar from "../Navbar/Navbar";
import NavMobile from "../Navbar/NavMobile";
import BarAnimation from "../Animations/BarAnimation";

export default function Signup() {
  const [, setActiveUser] = useAtom(activeUserAtom);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/signup`,
        formData
      );

      setActiveUser(response.data.email);
      localStorage.setItem("token", response.data.token);
    } catch (err: unknown) {
      const error = err as Error;
      console.log(error.message);
    }
  }

  return (
    <div className="viewNoSide">
      <Navbar />
      <NavMobile />
      <section className={styles.loginPage}>
        <div className={styles.login}>
          <h2>Create Account</h2>
          <div className={styles.oathButtons}>
            <button
              className={`button ${styles.loginBtn} ${styles.google}`}
              onClick={() =>
                (window.location.href = `${backendUrl}/api/google`)
              }
            >
              Continue with Google
            </button>
            <button className={`button ${styles.loginBtn} ${styles.github}`}>
              Continue with GitHub
            </button>
          </div>
          <BarAnimation/>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className={styles.loginCredentials}
          >
            <input
              className="input"
              type="email"
              placeholder="email"
              name="email"
              value={formData.email}
              onChange={(e) => {
                handleChange(e);
              }}
              required
            ></input>
            <input
              className="input"
              type="password"
              minLength={6}
              placeholder="password"
              value={formData.password}
              name="password"
              onChange={(e) => {
                handleChange(e);
              }}
              required
            ></input>
            <input
              className="input"
              type="password"
              minLength={6}
              placeholder="confirm password"
              value={formData.confirmPassword}
              name="confirmPassword"
              onChange={(e) => {
                handleChange(e);
              }}
              required
            ></input>
            <button type="submit" className={`button btn-primary`}>
              Create account
            </button>
          </form>
          <div className={styles.createAccountQuery}></div>
        </div>
        <div className={styles.loginBackground}></div>{" "}
      </section>
    </div>
  );
}
