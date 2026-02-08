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

      const [summaryRes, profilesRes, userProductsRes, activityRes, userRes] =
        await Promise.all([
          fetch(`${API_URL}/api/dashboard/summary`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/profiles`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          // 🆕 Fetch user products
          fetch(`${API_URL}/api/user-products`, {
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
      const activityData = await activityRes.json();
      const userData = await userRes.json();

      // 🆕 Combine profiles and user products
      const profiles = profilesData.data || [];
      const userProducts = userProductsData.data || [];

      // Transform profiles to unified format
      const transformedProfiles = profiles.map((profile) => ({
        id: `profile-${profile.id}`,
        type: "profile",
        originalId: profile.id,
        name: profile.name,
        profileType: profile.profileType,
        template: profile.template,
        color: profile.color,
        avatarUrl: profile.avatarUrl,
        isActive: profile.isActive,
        createdAt: profile.createdAt,
        viewCount: profile.viewCount || 0,
        designMode: profile.designMode,
        customDesignUrl: profile.customDesignUrl,
        aiBackground: profile.aiBackground,
        title: profile.title,
        bio: profile.bio,
      }));

      // Transform user products to unified format
      const transformedUserProducts = userProducts.map((up) => ({
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
        product: up.product,
      }));

      // Combine both arrays
      const combined = [...transformedProfiles, ...transformedUserProducts];

      // Sort by creation date (newest first)
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
