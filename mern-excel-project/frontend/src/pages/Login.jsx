import React, { useState } from "react";
import { register, login } from "../services/authService.js";

export default function Login() {
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("demo1234");
  const [name, setName] = useState("Demo User");
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "register") {
        const res = await register({ email, password, name });
        localStorage.setItem('token', res.token); localStorage.setItem('user', JSON.stringify(res.user));
        if(res.user.role === 'admin') return window.location = '/admin'; else return window.location = '/user';
      }
      const result = await login({ email, password });
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      window.location.href = "/";
    } catch (e) {
      setError(e.response?.data?.error || "Request failed");
    }
  };

  return (
    <div className="card" style={{ maxWidth: 520, margin: "60px auto" }}>
      <h2 style={{ marginTop: 0 }}>
        {mode === "login" ? "Login" : "Create account"}
      </h2>
      <form onSubmit={submit}>
        {mode === "register" && (
          <>
            <label>Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            <div className="spacer"></div>
          </>
        )}
        <label>Email</label>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="spacer"></div>
        <label>Password</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="spacer"></div>
        {error && <div style={{ color: "#ff8b8b", marginBottom: 12 }}>{error}</div>}
        <button className="btn" type="submit">{mode === "login" ? "Login" : "Register & Login"}</button>
        <button type="button" className="btn" style={{ marginLeft: 8 }} onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Need an account?" : "Have an account?"}
        </button>
      </form>
    </div>
  );
}
