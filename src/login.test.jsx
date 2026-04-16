import React from "react";
import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import Login from "./Login";

test("renders login input and button", () => {
  render(<Login onLogin={() => {}} />);

  expect(screen.getByPlaceholderText(/enter player name/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
});