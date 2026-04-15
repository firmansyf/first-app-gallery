"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type User = { id: string; username: string; name: string; avatar?: string } | null;

const AuthContext = createContext<{
  user: User;
  setUser: (u: User) => void;
  loading: boolean;
}>({ user: null, setUser: () => {}, loading: true });

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) return { user: null };
        return r.json();
      })
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
