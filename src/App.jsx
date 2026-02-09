import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast"; // ✅ Add this import
import { HelmetProvider } from "react-helmet-async";

// Layout
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";

// Pages
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import About from "./pages/About";
import OAuthSuccessWrapper from "./components/OAuthSuccessWrapper";
import OTPVerify from "./pages/OTPVerify";

import CreateCard from "./pages/CreateCard";
import BuildMenu from "./pages/BuildMenu";
import MenuViewer from "./pages/MenuViewer";
import PublicProfile from "./pages/PublicProfile";
import HowItWorks from "./pages/HowItWorks";
import VerifyAccount from "./pages/VerifyAccount";

// Dashboard
import DashboardLayout from "./layout/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import MyProfiles from "./pages/dashboard/MyProfiles";
import EditProfile from "./pages/dashboard/EditProfile";
import Analytics from "./pages/dashboard/Analytics";
import Settings from "./pages/dashboard/Settings";
import CartCheckout from "./pages/dashboard/CartCheckout";
import CartPage from "./pages/dashboard/CartPage";
import MyOrders from "./pages/dashboard/MyOrders";
import EditMenu from "./pages/dashboard/EditMenu";
// Helpers
import ScrollToTopButton from "./layout/ScrollToTopButton";

// Route Guards
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import NotFound from "./pages/NotFound";
import Gellary from "./pages/Gellary";

// pricing
import Pricing from "./pages/Pricing";
import Contacts from "./pages/dashboard/Contacts";

import SetupSocialLink from "./pages/setup/SetupSocialLink";
import SetupMenu from "./pages/setup/SetupMenu";
import SetupReview from "./pages/setup/SetupReview";
import PublicProductView from "./pages/PublicProductView";

/* ---------- SCROLL TO TOP COMPONENT ---------- */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

const AppContent = () => {
  const location = useLocation();

  const hideNavbarFooterPaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/dashboard",
    "/u/",
    "/menu/",
  ];

  const shouldHideNavbarFooter = hideNavbarFooterPaths.some((path) =>
    location.pathname.startsWith(path),
  );

  return (
    <>
      {/* ✅ Add Toaster component here */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
            padding: "16px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "500",
          },
          success: {
            duration: 2000,
            style: {
              background: "#10b981",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#10b981",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#ef4444",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#ef4444",
            },
          },
          loading: {
            style: {
              background: "#3b82f6",
            },
          },
        }}
      />

      <ScrollToTop />
      {!shouldHideNavbarFooter && <Navbar />}
      <Routes>
        {/* ---------- GUEST ONLY ---------- */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <SignUp />
            </GuestRoute>
          }
        />
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/oauth-success" element={<OAuthSuccessWrapper />} />
        <Route path="/verify-otp" element={<OTPVerify />} />
        <Route path="/verify-account" element={<VerifyAccount />} />
        <Route path="/u/:slug" element={<PublicProfile />} />
        <Route path="/u/p/:id" element={<PublicProductView />} />
        <Route path="/menu/:slug" element={<MenuViewer />} />
        <Route path="/create-card" element={<CreateCard />} />
        <Route path="/build-menu" element={<BuildMenu />} />
        <Route path="/gallery" element={<Gellary />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/pricing" element={<Pricing />} />

        <Route
          path="/setup-social-link/:userProductId"
          element={<SetupSocialLink />}
        />
        <Route path="/setup-menu/:userProductId" element={<SetupMenu />} />
        <Route path="/setup-review/:userProductId" element={<SetupReview />} />

        {/* ---------- PROTECTED USER ROUTES ---------- */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="profiles" element={<MyProfiles />} />
          <Route path="profiles/:id" element={<EditProfile />} />
          <Route path="edit/menu/:id" element={<EditMenu />} />
          <Route path="edit/profile/:id" element={<EditProfile />} />
          <Route path="edit/:type/:id" element={<EditProfile />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="order-card" element={<CartCheckout />} />
         <Route path="orders" element={<MyOrders />} />
          <Route path="contacts" element={<Contacts />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!shouldHideNavbarFooter && <Footer />}
      {/* Scroll to top button is now always visible on all pages including dashboard */}
      <ScrollToTopButton />
    </>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
