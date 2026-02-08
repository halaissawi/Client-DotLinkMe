import React, { useState, useEffect } from "react";
import DashboardHeader from "../../components/Dashboard/overView/DashboardHeader";
import StatsGrid from "../../components/Dashboard/overView/StatsGrid";
import ProfilesSection from "../../components/Dashboard/overView/ProfilesSection";
import RecentActivity from "../../components/Dashboard/overView/RecentActivity";
import ProfilePerformance from "../../components/Dashboard/overView/ProfilePerformance";
import QuickActions from "../../components/Dashboard/overView/QuickActions";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [allProducts, setAllProducts] = useState([]); // 🆕 Combined profiles + user products
  const [recentActivity, setRecentActivity] = useState([]);
  const [userName, setUserName] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [summaryRes, profilesRes, userProductsRes, menusRes, activityRes, userRes] =
        await Promise.all([
          fetch(`${API_URL}/api/dashboard/summary`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/profiles`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/user-products`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/menus/my-menus`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/dashboard/recent-activity?limit=5`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      const summaryData = await summaryRes.json();
      const profilesData = await profilesRes.json();
      const userProductsData = await userProductsRes.json();
      const menusData = await menusRes.json();
      const activityData = await activityRes.json();
      const userData = await userRes.json();

      const profiles = profilesData.data || [];
      const userProducts = userProductsData.data || [];
      const menus = menusData.data || [];

      const transformedProfiles = profiles.map((profile) => ({
        ...profile,
        id: `profile-${profile.id}`,
        type: "profile",
        originalId: profile.id,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        isActive: profile.isActive,
        createdAt: profile.createdAt,
        viewCount: profile.viewCount || 0,
        designMode: profile.designMode,
        customDesignUrl: profile.customDesignUrl,
        aiBackground: profile.aiBackground,
        title: profile.title,
        bio: profile.bio,
        slug: profile.slug,
        product: profile.product ? {
          ...profile.product,
          image: profile.product.image?.startsWith('http') || profile.product.image?.startsWith('/')
            ? profile.product.image
            : `/${profile.product.image}`
        } : null,
      }));

      const transformedUserProducts = userProducts.map((up) => ({
        ...up,
        id: `product-${up.id}`,
        type: "user-product",
        originalId: up.id,
        name: up.nickname || up.product?.name || "Unnamed Product",
        productType: up.productType,
        productCategory: up.product?.category,
        platform: up.product?.platform,
        isActive: up.isActive,
        setupComplete: up.setupComplete,
        createdAt: up.createdAt,
        image: up.product?.image?.startsWith('http') || up.product?.image?.startsWith('/') 
          ? up.product.image 
          : up.product?.image ? `/${up.product.image}` : null,
        product: up.product ? {
          ...up.product,
          image: up.product.image?.startsWith('http') || up.product.image?.startsWith('/') 
            ? up.product.image 
            : `/${up.product.image}`
        } : null,
      }));

      const transformedMenus = menus.map((menu) => ({
        ...menu,
        id: `menu-${menu.id}`,
        type: "menu",
        originalId: menu.id,
        name: menu.restaurantName,
        isActive: menu.status === "active",
        createdAt: menu.createdAt,
        image: "/products/menuNfcCard.avif",
        slug: menu.uniqueSlug,
        viewLink: `/menu/${menu.uniqueSlug}`,
      }));

      const combined = [...transformedProfiles, ...transformedUserProducts, ...transformedMenus];
      combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setStats(summaryData.data);
      setAllProducts(combined);
      setRecentActivity(activityData.data?.recentUpdates || []);

      const fullName = [
        userData.firstName,
        userData.secondName,
        userData.lastName,
      ]
        .filter(Boolean)
        .join(" ");
      setUserName(fullName || "User");
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-8 pb-8">
      <DashboardHeader userName={userName} />

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProfilesSection profiles={allProducts} />
        <RecentActivity activities={recentActivity} />
      </div>

      {stats?.profiles && stats.profiles.length > 0 && (
        <ProfilePerformance profiles={stats.profiles} />
      )}

      <QuickActions />
    </div>
  );
}
