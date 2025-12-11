import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  Users,
  ShoppingCart,
  ClipboardList,
  BarChart2,
  Settings,
  Plus,
  LogOut,
  X,
  Menu,
  UserCircle,
} from "lucide-react";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;

  const { logout } = useAuth();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        const data = await response.json();

        const fullName = [data.firstName, data.secondName, data.lastName]
          .filter(Boolean)
          .join(" ");

        setUserInfo({
          name: fullName || "User",
          email: data.email || "",
        });
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserInfo({ name: "User", email: "" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [API_URL]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      path: "/dashboard",
      icon: <Home className="w-5 h-5" />,
      label: "Overview",
    },
    {
      path: "/dashboard/profiles",
      icon: <Users className="w-5 h-5" />,
      label: "My Profiles",
    },
    {
      path: "/dashboard/cart",
      icon: <ShoppingCart className="w-5 h-5" />,
      label: "Order Card",
    },
    {
      path: "/dashboard/my-orders",
      icon: <ClipboardList className="w-5 h-5" />,
      label: "My Orders",
    },
    {
      path: "/dashboard/analytics",
      icon: <BarChart2 className="w-5 h-5" />,
      label: "Analytics",
    },
    {
      path: "/dashboard/contacts",
      icon: <UserCircle className="w-5 h-5" />,
      label: "Contacts",
    },
    {
      path: "/dashboard/settings",
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
    },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-40 px-4 py-3 flex items-center justify-between shadow-sm">
        <Link
          to="/"
          className="text-xl sm:text-[22px] font-extrabold tracking-tight flex items-center gap-1"
        >
          <span className="text-brand-accent">Dot</span>
          <span className="text-brand-primary">LinkMe</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      <div className="flex h-screen pt-16 lg:pt-0">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 right-0 lg:left-0 z-50 w-72 bg-white border-l lg:border-l-0 lg:border-r border-gray-200 transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none ${
            sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="h-full flex flex-col overflow-hidden">
            {/* Logo Section - Fixed */}
            <div className="flex-shrink-0 p-6 border-b border-gray-100">
              <Link to="/" className="flex items-center gap-3 group">
                <div>
                  <div className="text-[22px] font-extrabold tracking-tight flex items-center gap-1">
                    <span className="text-brand-accent">Dot</span>
                    <span className="text-brand-primary">LinkMe</span>
                  </div>
                  <p className="text-xs text-gray-500">Smart NFC Platform</p>
                </div>
              </Link>
            </div>

            {/* User Profile Card - Fixed */}
            <div className="flex-shrink-0 p-4 border-b border-gray-100">
              {loading ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                    <div className="h-3 bg-gray-300 rounded w-32"></div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-brand-primary/5 to-blue-50 border border-brand-primary/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-blue-600 flex items-center justify-center text-white font-semibold shadow-md flex-shrink-0">
                    {userInfo.name.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {userInfo.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userInfo.email || "user@example.com"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Menu - Scrollable */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Main Menu
              </p>
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-brand-primary to-blue-600 text-white shadow-lg shadow-brand-primary/30"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  aria-current={isActive(item.path) ? "page" : undefined}
                >
                  <span
                    className={`transition-transform group-hover:scale-110 flex-shrink-0 ${
                      isActive(item.path) ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium flex-1">{item.label}</span>
                  {isActive(item.path) && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Quick Actions - Fixed at bottom */}
            <div className="flex-shrink-0 p-4 border-t border-gray-100 space-y-2">
              <Link
                to="/create-card"
                className="flex items-center gap-3 px-4 py-3 rounded-xl btn-accent text-white hover:shadow-lg transition-all group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform flex-shrink-0" />
                <span className="font-medium">Create Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all group"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 h-full overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
