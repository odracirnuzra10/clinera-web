"use client";
import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "clinera2026admin";
const STORAGE_KEY = "clinera_admin_auth";

export function useAdminAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === "true") setAuthenticated(true);
    setChecked(true);
  }, []);

  function login(password: string): boolean {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setAuthenticated(true);
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthenticated(false);
  }

  return { authenticated, checked, login, logout };
}
