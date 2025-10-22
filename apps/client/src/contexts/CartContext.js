//  apps/slient/src/context/CartContext.js
"use client";
import { createContext, useContext, useReducer, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    // This new action handles setting the cart and indicating that loading is complete.
    case "LOAD_CART":
      return { ...state, items: action.payload, loading: false };

    // All other actions now just modify the items array.
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
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  // The initial state now includes a `loading` flag, set to true.
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    loading: true,
  });

  // This effect runs ONLY ONCE on the client to load the cart.
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      // If a cart exists in storage, load it. Otherwise, load an empty array.
      if (savedCart) {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) });
      } else {
        // We are no longer loading, even if the cart was empty.
        dispatch({ type: "LOAD_CART", payload: [] });
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage.", error);
      // If parsing fails, default to an empty cart and stop loading.
      dispatch({ type: "LOAD_CART", payload: [] });
    }
  }, []);

  // This separate effect syncs the cart to localStorage whenever items change.
  // It will NOT run on the initial render or while loading is true.
  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem("cart", JSON.stringify(state.items));
    }
  }, [state.items, state.loading]);

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
  };

  const getCartItemCount = () =>
    state.items.reduce((total, item) => total + item.quantity, 0);

  const getCartTotal = () =>
    state.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

  return (
    <CartContext.Provider
      value={{
        ...state, // This now includes `items` AND `loading`
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartItemCount,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
