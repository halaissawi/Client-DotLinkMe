import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import ProfilesHeader from "../../components/Dashboard/MyProfile/ProfilesHeader";
import ProfilesStats from "../../components/Dashboard/MyProfile/ProfilesStats";
import ProfilesFilters from "../../components/Dashboard/MyProfile/ProfilesFilters";
import ProfilesGrid from "../../components/Dashboard/MyProfile/ProfilesGrid";
import ProfilesList from "../../components/Dashboard/MyProfile/ProfilesList";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function MyProfiles() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showQR, setShowQR] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const [profilesRes, userProductsRes] = await Promise.all([
        fetch(`${API_URL}/api/profiles`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/user-products`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      const profilesData = await profilesRes.json();
      const userProductsData = await userProductsRes.json();

      const profiles = profilesData.data || [];
      const userProducts = userProductsData.data || [];

      // Transform profiles to unified format
      const transformedProfiles = profiles.map((profile) => ({
        ...profile,
        id: profile.id, // Keep as number/string for compatibility
        unifiedId: `profile-${profile.id}`,
        type: "profile",
      }));

      // Transform user products to unified format
      const transformedUserProducts = userProducts.map((up) => ({
        ...up,
        id: up.id,
        unifiedId: `product-${up.id}`,
        type: "user-product",
        name: up.nickname || up.product?.name || "Unnamed Product",
        profileType: up.productType, // For filtering
        platform: up.platform || up.product?.platform,
      }));

      const combined = [...transformedProfiles, ...transformedUserProducts];
      combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setAllProducts(combined);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = item.type === "profile" 
        ? `${API_URL}/api/profiles/${item.id}/toggle-status`
        : `${API_URL}/api/user-products/${item.id}/toggle-status`;

      await fetch(endpoint, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllProducts(
        allProducts.map((p) =>
          p.unifiedId === item.unifiedId ? { ...p, isActive: !item.isActive } : p
        )
      );
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleDeleteItem = async (item) => {
    const isProfile = item.type === "profile";
    
    const result = await Swal.fire({
      title: isProfile ? "Delete Profile?" : "Delete Product?",
      html: `
        <p>Are you sure you want to delete <strong>${
          item.name || "this item"
        }</strong>?</p>
        <p class="text-sm text-gray-600 mt-2">This action cannot be undone.</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const endpoint = isProfile 
        ? `${API_URL}/api/profiles/${item.id}`
        : `${API_URL}/api/user-products/${item.id}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (isProfile && data.hasOrders) {
          // Keep existing logic for profile with orders
          await Swal.fire({
            icon: "error",
            title: "Cannot Delete Profile",
            html: `
              <div class="text-left">
                <p class="text-gray-700 mb-3">${data.message}</p>
                <div class="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <p class="text-sm font-semibold text-yellow-900 mb-2">
                    <svg class="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                    </svg>
                    Profile Locked
                  </p>
                  <p class="text-sm text-yellow-800 mb-2">
                    You have <strong>${data.orderCount} order(s)</strong> for physical cards with this profile.
                  </p>
                  <p class="text-sm text-yellow-800">
                    <strong>Good news:</strong> You can still edit all profile information!
                  </p>
                </div>
              </div>
            `,
            confirmButtonColor: "#060640",
            confirmButtonText: "Got it",
            width: "600px",
          });
        } else {
          throw new Error(data.error || data.message || "Failed to delete item");
        }
        return;
      }

      await Swal.fire({
        title: "Deleted!",
        text: "Deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      setAllProducts(allProducts.filter((p) => p.unifiedId !== item.unifiedId));
    } catch (error) {
      console.error("Error deleting item:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Failed to delete.",
        icon: "error",
        confirmButtonColor: "#060640",
      });
    }
  };

  const handleShare = async (item) => {
    const shareUrl = item.type === "profile" 
      ? `${window.location.origin}/u/${item.slug}`
      : `${window.location.origin}/u/p/${item.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          text: item.type === "profile" ? item.bio : `Connect with me on ${item.name}`,
          url: shareUrl,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Copied!",
            text: "Link copied to clipboard!",
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: "top-end",
          });
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Failed to copy link.",
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: "top-end",
          });
        });
    }
  };

  const handleCopyLink = (item) => {
    const url = item.type === "profile" 
      ? `${window.location.origin}/u/${item.slug}`
      : `${window.location.origin}/u/p/${item.id}`;
      
    navigator.clipboard
      .writeText(url)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Copied!",
          text: "Link copied to clipboard!",
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Failed to copy link.",
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
      });
  };

  const filteredProducts = allProducts.filter((item) => {
    if (filter === "all") return true;
    if (filter === "active") return item.isActive;
    if (filter === "inactive") return !item.isActive;
    
    // Exact product type matches
    if (filter === "social_link") return item.productType === "social_link";
    if (filter === "menu") return item.productType === "menu";
    if (filter === "review") return item.productType === "review";
    
    // Profile type matches
    if (filter === "personal") return item.type === "profile" && item.profileType === "personal";
    if (filter === "business") return item.type === "profile" && item.profileType === "business";
    
    return true;
  });

  if (loading) {
    return <LoadingSpinner fullPage text="Loading profiles..." />;
  }

  return (
    <div className="space-y-6">
      <ProfilesHeader />

      <ProfilesStats profiles={allProducts} />

      <ProfilesFilters
        filter={filter}
        setFilter={setFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Profiles Grid/List */}
      {filteredProducts.length === 0 ? (
        <div
          className="p-16 text-center rounded-xl border border-gray-200 bg-white"
          style={{
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          }}
        >
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-brand-dark mb-3">
            No items found
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {filter === "all"
              ? "Create your first smart digital card and start connecting with people"
              : `No ${filter} items found. Try adjusting your filters.`}
          </p>
          {filter === "all" && (
            <Link
              to="/create-card"
              className="btn-primary-clean px-8 py-4 inline-flex items-center gap-2 shadow-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Your First Profile
            </Link>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <ProfilesGrid
          profiles={filteredProducts}
          showQR={showQR}
          setShowQR={setShowQR}
          onShare={handleShare}
          onCopyLink={handleCopyLink}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteItem}
        />
      ) : (
        <ProfilesList
          profiles={filteredProducts}
          showQR={showQR}
          setShowQR={setShowQR}
          onShare={handleShare}
          onCopyLink={handleCopyLink}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  );
}
