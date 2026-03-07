import React, { useState } from "react";
function Signup({ setAuthMode, setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.newUser));
      setUser(data.newUser);
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="joinRoom">
      <h1>Chat App</h1>
      <h2>Signup</h2>

      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Enter name"
          onChange={(e) => setName(e.target.value)}
        />
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
        <button type="submit">Signup</button>
      </form>

      <p style={{ marginTop: "10px" }}>
        Already have account?{" "}
        <span
          style={{ color: "#25d366", cursor: "pointer" }}
          onClick={() => setAuthMode("login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default Signup;
