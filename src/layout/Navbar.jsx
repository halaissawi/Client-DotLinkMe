import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  CreditCard,
  Info,
  Mail,
  HelpCircle,
  User,
  LogOut,
} from "lucide-react";

const Navbar = () => {
  const { token, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "business";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  // Helper for NavLink class
  const navLinkClass = ({ isActive }) =>
    isActive
      ? "nav-link-pro active text-brand-accent font-bold"
      : "nav-link-pro";

  const mobileNavItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/create-card", label: "Create Card", icon: CreditCard },
    { to: "/how-it-works", label: "How It Works", icon: HelpCircle },
    { to: "/about", label: "About", icon: Info },
    { to: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 w-full z-[1000] transition-all duration-300
          ${scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-sm"
            : "bg-transparent"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          {/* LOGO */}
          <NavLink
            to="/"
            className="text-[22px] font-extrabold tracking-tight flex items-center gap-1 relative z-[1001]"> 
            <span className="font-bold text-brand-primary whitespace-nowrap">
              <span className="inline-block w-2 h-2 sm:w-2 sm:h-2 md:w-2 md:h-2 bg-[#f2a91d] rounded-full translate-y-[2px]"></span>
              LinkMe
            </span>

          </NavLink>

          {/* DESKTOP NAV */}
          <ul className="hidden lg:flex items-center gap-10 text-[16px] font-medium text-gray-700">
            <li>
              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/create-card" className={navLinkClass}>
                Create Card
              </NavLink>
            </li>
            <li>
              <NavLink to="/how-it-works" className={navLinkClass}>
                How It Works
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={navLinkClass}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={navLinkClass}>
                Contact
              </NavLink>
            </li>
          </ul>

          {/* DESKTOP BUTTONS */}
          <div className="hidden lg:flex items-center gap-4">
            {token ? (
              <>
                <NavLink to="/dashboard" className="btn-ghost-clean">
                  Profile
                </NavLink>
                <button onClick={handleLogout} className="btn-primary-clean">
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" className="btn-primary-clean">
                Sign In
              </NavLink>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden relative z-[1001] p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-brand-primary" />
            ) : (
              <Menu className="w-6 h-6 text-brand-primary" />
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY & DRAWER */}
      <div
        className={`
          lg:hidden fixed inset-0 z-[999] transition-all duration-300
          ${isMenuOpen
            ? "visible opacity-100"
            : "invisible opacity-0 pointer-events-none"
          }
        `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`
            absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl
            transform transition-transform duration-300 ease-out
            ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
            flex flex-col
          `}
        >
          {/* Header */}
          <div className="px-6 pt-24 pb-6 border-b border-gray-100">
            {token && user ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold text-lg">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Welcome!
                </h3>
                <p className="text-sm text-gray-500">
                  Sign in to access your profile
                </p>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <nav className="space-y-1">
              {mobileNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`
                      flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
                      ${isActive
                        ? "bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 text-brand-primary font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-brand-primary" : "text-gray-400"
                        }`}
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-accent" />
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 space-y-3">
            {token ? (
              <>
                <NavLink
                  to="/dashboard"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl border-2 border-brand-primary text-brand-primary font-semibold hover:bg-brand-primary hover:text-white transition-all duration-200"
                >
                  <User className="w-5 h-5" />
                  <span>My Profile</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-brand-primary to-blue-600 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                <User className="w-5 h-5" />
                <span>Sign In</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
