import { useEffect, useState } from "react";

const USERS_KEY = "psychediet_users";
const SESSION_KEY = "psychediet_session";

function hashPassword(password: string): string {
  return btoa(unescape(encodeURIComponent(`${password}_psychediet_salt`)));
}

function getUsers(): Record<string, string> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, string>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function useUserAuth() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem(SESSION_KEY);
  });

  const isLoggedIn = currentUser !== null;

  function register(
    username: string,
    password: string,
  ): { success: boolean; error?: string } {
    if (!username.trim() || !password.trim()) {
      return { success: false, error: "Username and password are required." };
    }
    const users = getUsers();
    if (users[username.toLowerCase()]) {
      return {
        success: false,
        error: "Username already exists. Please log in.",
      };
    }
    users[username.toLowerCase()] = hashPassword(password);
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, username);
    setCurrentUser(username);
    return { success: true };
  }

  function login(
    username: string,
    password: string,
  ): { success: boolean; error?: string } {
    if (!username.trim() || !password.trim()) {
      return { success: false, error: "Username and password are required." };
    }
    const users = getUsers();
    const stored = users[username.toLowerCase()];
    if (!stored) {
      return {
        success: false,
        error: "No account found. Please register first.",
      };
    }
    if (stored !== hashPassword(password)) {
      return { success: false, error: "Incorrect password. Please try again." };
    }
    localStorage.setItem(SESSION_KEY, username);
    setCurrentUser(username);
    return { success: true };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
  }

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    setCurrentUser(stored);
  }, []);

  return { currentUser, isLoggedIn, register, login, logout };
}
