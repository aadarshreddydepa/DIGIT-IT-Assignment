import { createContext, useState, type ReactNode } from "react";
import { type IUser } from "../types/User";

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  login: (payload: { token: string; user: IUser }) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = (payload: { token: string; user: IUser }) => {
    localStorage.setItem("token", payload.token);
    localStorage.setItem("user", JSON.stringify(payload.user));

    setToken(payload.token);
    setUser(payload.user);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
