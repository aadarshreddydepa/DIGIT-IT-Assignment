import { createContext, useState,type ReactNode } from "react";
import type { IUser } from "../types/User";

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  teacher: IUser | null;
  login: (payload: { token: string; user: IUser; teacher?: IUser | null }) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  teacher: null,
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

  const [teacher, setTeacher] = useState<IUser | null>(
    JSON.parse(localStorage.getItem("teacher") || "null")
  );

  const login = (payload: { token: string; user: IUser; teacher?: IUser | null }) => {
    localStorage.setItem("token", payload.token);
    localStorage.setItem("user", JSON.stringify(payload.user));

    if (payload.teacher) {
      localStorage.setItem("teacher", JSON.stringify(payload.teacher));
      setTeacher(payload.teacher);
    } else {
      localStorage.removeItem("teacher");
      setTeacher(null);
    }

    setToken(payload.token);
    setUser(payload.user);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setTeacher(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, teacher, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
