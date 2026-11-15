"use client";

import { create } from "zustand";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

interface AuthStore {
  user: SessionUser | null;
  ready: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<SessionUser>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<SessionUser>;
  logout: () => Promise<void>;
}

async function postJSON(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || "Something went wrong");
  }
  return data;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  ready: false,

  refresh: async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      set({ user: data.user ?? null, ready: true });
    } catch {
      set({ user: null, ready: true });
    }
  },

  login: async (email, password) => {
    const data = await postJSON("/api/auth/login", { email, password });
    set({ user: data.user });
    return data.user as SessionUser;
  },

  register: async (name, email, password) => {
    const data = await postJSON("/api/auth/register", { name, email, password });
    set({ user: data.user });
    return data.user as SessionUser;
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      set({ user: null });
    }
  },
}));
