// File: apps/client/src/components/layout/Header.jsx
"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ShoppingCart, User, Menu, X, Search, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import LoginForm from "../auth/LoginForm";
import { SearchBar } from "./SearchBar";

const Header = () => {
  // *** FIX: Destructure loading state from useCart and alias it ***
  const { getCartItemCount, loading: isCartLoading } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const itemCount = getCartItemCount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false); // For unauthenticated login form
  const [showAuthDropdown, setShowAuthDropdown] = useState(false); // For authenticated menu
  const [showMobileUserDropdown, setShowMobileUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const userIconRef = useRef(null);

  const navLinks = [
    { href: "/products", label: "Shop" },
    { href: "#", label: "New Arrivals" },
    { href: "#", label: "Sales" },
  ];

  // *** FIX: Simplified click handler ***
  const handleUserClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      setShowAuthDropdown(!showAuthDropdown);
      setShowLoginDropdown(false); // Ensure login dropdown is closed
    } else {
      setShowLoginDropdown(!showLoginDropdown);
      setShowAuthDropdown(false); // Ensure auth dropdown is closed
    }
  };

  const handleLogout = () => {
    logout();
    setShowAuthDropdown(false);
    setShowMobileUserDropdown(false);
  };

  const toggleMobileUserDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMobileUserDropdown(!showMobileUserDropdown);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        userIconRef.current &&
        !userIconRef.current.contains(event.target)
      ) {
        setShowLoginDropdown(false);
        setShowAuthDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
        aria-label="Global"
      >
        {/* Hamburger Menu Icon (Mobile) */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link
            href="/"
            className="-m-1.5 p-1.5 text-2xl font-bold text-primary-600"
          >
            <img className="max-w-[50%]" src={"/blashberry_logo.png"} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-center px-8">
          <SearchBar />
        </div>

        {/* Icons (Desktop) */}
        <div className="flex-row flex justify-end items-center relative">
          <Link href="/cart" className="relative mr-4">
            <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-primary-600" />
            {/* *** FIX: Check isCartLoading before rendering count *** */}
            {!isCartLoading && itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs bolder text-dark">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User Icon and Dropdown Logic */}
          <div
            ref={userIconRef}
            className="relative cursor-pointer"
            onClick={handleUserClick} // Use onClick for both states
          >
            {!isAuthenticated ? (
              // Logged-out user icon
              <User className="h-6 w-6 text-gray-600 hover:text-primary-600" />
            ) : (
              // Logged-in user icon and name
              <div className="flex items-center">
                <User className="h-6 w-6 text-gray-600 hover:text-primary-600" />
                <span className="ml-1 text-sm font-medium text-gray-700">
                  {user?.name || "Account"}
                </span>
              </div>
            )}

            {/* Unauthenticated: Login Dropdown */}
            {showLoginDropdown && !isAuthenticated && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 p-4 border border-gray-200"
                onClick={(e) => e.stopPropagation()} // Prevent click from closing menu
              >
                <LoginForm onSuccess={() => setShowLoginDropdown(false)} />
              </div>
            )}

            {/* Authenticated: User Menu Dropdown */}
            {showAuthDropdown && isAuthenticated && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
                onClick={(e) => e.stopPropagation()} // Prevent click from closing menu
              >
                <Link
                  href="/my-account"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowAuthDropdown(false)}
                >
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden ${isMenuOpen ? "block" : "hidden"}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 z-50" />
        <div className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="-m-1.5 p-1.5 text-2xl font-bold text-primary-600"
            >
              BlashBerry
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <div className="px-2">
                  <SearchBar />
                </div>
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)} // Close menu on nav click
                  >
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated ? (
                  <Link
                    href="/my-account"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </Link>
                ) : (
                  <div>
                    <button
                      onClick={toggleMobileUserDropdown}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 w-full text-left justify-between items-center"
                    >
                      <span>Hi, {user?.name}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          showMobileUserDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {showMobileUserDropdown && (
                      <div className="ml-4 mt-2 space-y-1">
                        <Link
                          href="/my-account"
                          className="block rounded-lg px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setShowMobileUserDropdown(false);
                          }}
                        >
                          My Account
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
