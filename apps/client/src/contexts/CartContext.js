//  apps/slient/src/context/CartContext.js
// File: apps/client/src/contexts/CartContext.js
"use client";
import { createContext, useContext, useReducer, useEffect } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api"; // axios instance
import Cookies from "js-cookie";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_CART":
      return { ...state, items: action.payload, loading: false };

    case "ADD_TO_CART": {
      const { product, quantity, size } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product._id === product._id && item.size === size
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product._id === product._id && item.size === size
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return { ...state, items: [...state.items, { product, quantity, size }] };
    }

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.product._id === action.payload.productId &&
          item.size === action.payload.size
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(
              item.product._id === action.payload.productId &&
              item.size === action.payload.size
            )
        ),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "SET_BUY_NOW_ITEM":
      return { ...state, buyNowItem: action.payload };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    loading: true,
    buyNowItem: null,
  });

  // Load cart from localStorage once on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      dispatch({
        type: "LOAD_CART",
        payload: savedCart ? JSON.parse(savedCart) : [],
      });
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      dispatch({ type: "LOAD_CART", payload: [] });
    }
  }, []);

  // Sync cart with localStorage whenever items change
  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem("cart", JSON.stringify(state.items));
    }
  }, [state.items, state.loading]);

  // 🧠 Add to Cart
  const addToCart = (product, quantity = 1, size) => {
    if (!size) {
      toast.error("Please select a size first.");
      return;
    }
    dispatch({ type: "ADD_TO_CART", payload: { product, quantity, size } });
    toast.success(`${product.name} added to cart!`);
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { productId, size, quantity },
      });
    }
  };

  const removeFromCart = (productId, size) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { productId, size } });
    toast.success("Item removed from cart.");
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    localStorage.removeItem("cart");
  };

  const setBuyNowItem = (item) => {
    dispatch({ type: "SET_BUY_NOW_ITEM", payload: item });
  };

  const getCartItemCount = () =>
    state.items.reduce((total, item) => total + item.quantity, 0);

  const getCartTotal = () =>
    state.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

  // ✅ mergeLocalCart: Sync guest cart → user cart after login/signup
  const mergeLocalCart = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) return;

      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (localCart.length === 0) return;

      const payload = localCart.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        size: item.size,
      }));

      const res = await api.post(
        "/api/cart/merge",
        { items: payload },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Replace local cart with merged result from backend
      const mergedItems = res.data.data || [];
      dispatch({ type: "LOAD_CART", payload: mergedItems });
      localStorage.setItem("cart", JSON.stringify(mergedItems));

      toast.success("Your cart has been synced successfully!");
    } catch (error) {
      console.error("Cart merge failed:", error);
      toast.error("Failed to sync your cart.");
    }
  };

  // ✅ clearCartForLogout: Reset cart locally on logout
  const clearCartForLogout = () => {
    dispatch({ type: "CLEAR_CART" });
    localStorage.removeItem("cart");
    toast.success("Cart cleared.");
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartItemCount,
        getCartTotal,
        mergeLocalCart,
        clearCartForLogout,
        setBuyNowItem,
        buyNowItem: state.buyNowItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
