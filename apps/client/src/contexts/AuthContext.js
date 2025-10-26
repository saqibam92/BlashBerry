// File: apps/client/src/contexts/AuthContext.js
"use client";
import { createContext, useContext, useReducer, useEffect } from "react";
import api from "@/lib/api";
import Cookies from "js-cookie";
import { useCart } from "./CartContext"; // Import useCart

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

  // This hook will now work correctly because CartProvider is the parent
  const cartContext = useCart();

  useEffect(() => {
    const loadUser = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const res = await api.get("/api/auth/me");
          dispatch({ type: "AUTH_SUCCESS", payload: { user: res.data.user } });
        } catch (err) {
          Cookies.remove("token");
          dispatch({ type: "AUTH_ERROR", payload: "Session expired." });
        }
      } else {
        dispatch({ type: "LOGOUT" });
      }
    };
    loadUser();
  }, []);

  const login = async (email, password, isAdmin = false) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const endpoint = isAdmin ? "/api/auth/admin/login" : "/api/auth/login";
      const res = await api.post(endpoint, { email, password });
      Cookies.set("token", res.data.token, { expires: 7, secure: true });

      // *** MERGE CART ON LOGIN ***
      // Safely call the merge function from the context
      if (cartContext && cartContext.mergeLocalCart) {
        await cartContext.mergeLocalCart();
      }

      // Dispatch success after merging is complete
      dispatch({ type: "AUTH_SUCCESS", payload: { user: res.data.user } });

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      dispatch({ type: "AUTH_ERROR", payload: message });
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      Cookies.set("token", res.data.token, { expires: 7, secure: true });

      // Merge cart after registration
      if (cartContext && cartContext.mergeLocalCart) {
        await cartContext.mergeLocalCart();
      }

      dispatch({ type: "AUTH_SUCCESS", payload: { user: res.data.user } });

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      dispatch({ type: "AUTH_ERROR", payload: message });
      return { success: false, error: message };
    }
  };

  const logout = () => {
    Cookies.remove("token");
    dispatch({ type: "LOGOUT" });
    // Also clear the cart to a guest state
    if (cartContext && cartContext.clearCartForLogout) {
      cartContext.clearCartForLogout();
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
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
