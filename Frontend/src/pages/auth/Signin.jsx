import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Signin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [FormData, setFormData] = useState({
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Signin data:", FormData);

      // Wait until signin is successfully completed
      const response = await login(FormData);

      console.log("Login successful:", response);

      // Go to Dashboard
      navigate("/", { replace: true });

      // Clear form
      setFormData({
        email: "",
        password: "",
      });
    } catch (err) {
      console.log("Signin failed:", err.message);
    }
  };

  return (
    <div className="form2">
      <fieldset>
        <h2>Signin</h2>
        <br />

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>

          <input
            type="text"
            id="email"
            name="email"
            onChange={onHandleChange}
            value={FormData.email}
          />

          <br />

          <label htmlFor="password">Password</label>

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

          <button type="submit">Signin</button>
        </form>
      </fieldset>
    </div>
  );
};

export default Signin;