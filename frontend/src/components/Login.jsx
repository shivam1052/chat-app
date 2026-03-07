import React, { useState } from "react";

function Login({ setUser, setAuthMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.log("Login error:", err);
      alert("Login failed. Check console.");
    }
  };

  return (
    <div className="joinRoom">
      <h1>Chat App</h1>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: "10px" }}>
        Don't have account?{" "}
        <span
          style={{ color: "#25d366", cursor: "pointer" }}
          onClick={() => setAuthMode("signup")}
        >
          Signup
        </span>
      </p>
    </div>
  );
}

export default Login;
