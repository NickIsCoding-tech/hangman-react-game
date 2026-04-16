import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [nameInput, setNameInput] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!nameInput.trim()) return;

    onLogin(nameInput.trim());
    setNameInput("");
  }

  return (
    <section className="card">
      <h2 className="cardTitle">Player Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter player name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <button type="submit" className="primaryBtn" style={{ marginLeft: "10px" }}>
          Login
        </button>
      </form>
    </section>
  );
}