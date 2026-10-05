import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Lottie from "lottie-react";
import axios from "axios";
import uncle from "../../lottie/DancingUncle.json";
import apiClient from "../../ApiClient/interceptor";

const Signup = () => {

  const [FormData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [visible, setVisible] = useState(true);

  const onHandleChange = (e) => {
    setFormData({
      ...FormData,
      [e.target.name]: e.target.value,
    });
  };

  const signupAxios = async (FormData) => {
    try {

      const response = await apiClient.post(
        "auth/signup",
        FormData
      );

      console.log("SIGNUP RESPONSE:", response.data);

    } catch (err) {

      console.log("SIGNUP ERROR:", err.response?.data);

    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("FORM DATA:", FormData);

    signupAxios(FormData);

    setFormData({
      userName: "",
      email: "",
      password: "",
    });
  };

  const LottieComponenent = Lottie.default || Lottie;

  return (
    <div className="form2">

      <fieldset>

        <h2>Signup</h2>
        <br />

        <form onSubmit={handleSubmit}>

          <label htmlFor="userName">
            User Name
          </label>

          <input
            type="text"
            id="userName"
            name="userName"
            onChange={onHandleChange}
            value={FormData.userName}
          />

          <br />

          <label htmlFor="email">
            Email
          </label>

          <input
            type="text"
            id="email"
            name="email"
            onChange={onHandleChange}
            value={FormData.email}
          />

          <br />

          <label htmlFor="password">
            Password
          </label>

          <input
            type={visible ? "password" : "text"}
            id="password"
            name="password"
            onChange={onHandleChange}
            value={FormData.password}
          />

          <div id="eyeFeature">

            {visible ? (
              <Eye
                onClick={() => {
                  setVisible(!visible);
                }}
              />
            ) : (
              <EyeOff
                onClick={() => {
                  setVisible(!visible);
                }}
              />
            )}

          </div>

          <br />

          <button type="submit">
            Signup
          </button>

        </form>

      </fieldset>

      <div id="uncledance">

        <LottieComponenent
          animationData={uncle}
          loop={true}
        />

      </div>

    </div>
  );
};

export default Signup;