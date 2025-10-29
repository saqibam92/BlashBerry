// File: apps/client/src/contexts/AuthContext.js

"use client";
import { createContext, useContext, useReducer, useEffect } from "react";
import api from "@/lib/api";
import Cookies from "js-cookie";
import { useCart } from "./CartContext";
import { mergeGuestOrders } from "@/lib/authApi";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "AUTH_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        isAuthenticated: true,
        error: null,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: null,
        isAuthenticated: false,
      };
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload.user,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const cartContext = useCart();

  // useEffect(() => {
  //   const loadUser = async () => {
  //     dispatch({ type: "LOGIN_START" });
  //     const token = Cookies.get("token");
  //     if (token) {
  //       try {
  //         const res = await api.get("/api/auth/me");
  //         dispatch({ type: "AUTH_SUCCESS", payload: { user: res.data.user } });
  //       } catch (err) {
  //         console.error("Load user error:", err);
  //         Cookies.remove("token");
  //         dispatch({ type: "AUTH_ERROR", payload: "Session expired." });
  //       }
  //     } else {
  //       dispatch({ type: "LOGOUT" });
  //     }
  //   };
  //   loadUser();
  // }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      dispatch({ type: "LOGOUT" });
      return;
    }

    const loadUser = async () => {
      try {
        const res = await api.get("/api/auth/me");
        dispatch({ type: "AUTH_SUCCESS", payload: { user: res.data.user } });
      } catch (err) {
        console.error("Load user error:", err);
        Cookies.remove("token");
        dispatch({ type: "AUTH_ERROR", payload: "Session expired." });
      }
    };

    loadUser();
  }, []);

  const login = async (email, password, isAdmin = false, guestEmail = null) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const endpoint = isAdmin ? "/api/auth/admin/login" : "/api/auth/login";
      const res = await api.post(endpoint, { email, password });
      Cookies.set("token", res.data.token, { expires: 7, secure: true });

      if (cartContext && cartContext.mergeLocalCart) {
        await cartContext.mergeLocalCart();
      }

      if (guestEmail) {
        await mergeGuestOrders(guestEmail);
      }

      dispatch({ type: "AUTH_SUCCESS", payload: { user: res.data.user } });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      dispatch({ type: "AUTH_ERROR", payload: message });
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password, guestEmail = null) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      Cookies.set("token", res.data.token, { expires: 7, secure: true });

      if (cartContext && cartContext.mergeLocalCart) {
        await cartContext.mergeLocalCart();
      }

      if (guestEmail) {
        await mergeGuestOrders(guestEmail);
      }

      dispatch({ type: "AUTH_SUCCESS", payload: { user: res.data.user } });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      dispatch({ type: "AUTH_ERROR", payload: message });
      return { success: false, error: message };
    }
  };

  const updateUser = async (name, password) => {
    try {
      const payload = { name };
      if (password) payload.password = password;
      const res = await api.put("/api/auth/update", payload, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
      dispatch({ type: "UPDATE_USER", payload: { user: res.data.user } });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update profile";
      dispatch({ type: "AUTH_ERROR", payload: message });
      return { success: false, error: message };
    }
  };

  const logout = () => {
    Cookies.remove("token");
    dispatch({ type: "LOGOUT" });
    if (cartContext && cartContext.clearCartForLogout) {
      cartContext.clearCartForLogout();
    }
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
