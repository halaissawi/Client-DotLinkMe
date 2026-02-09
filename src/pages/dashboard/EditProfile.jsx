import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Save, X, Check, AlertTriangle } from "lucide-react";
import EditProfileHeader from "../../components/Dashboard/EditProfile/EditProfileHeader";
import EditProfileTabs from "../../components/Dashboard/EditProfile/EditProfileTabs";
import BasicInfoForm from "../../components/Dashboard/EditProfile/BasicInfoForm";
import DesignEditorTab from "../../components/Dashboard/EditProfile/DesignEditorTab";
import SocialLinksTab from "../../components/Dashboard/EditProfile/SocialLinksTab";
import SettingsTab from "../../components/Dashboard/EditProfile/SettingsTab";
import ProfileSidebar from "../../components/Dashboard/EditProfile/ProfileSidebar";
import MenuEditorTab from "../../components/Dashboard/EditProfile/MenuEditorTab";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import SocialLinkModal from "../../components/SocialLinkModal";

export default function EditProfile() {
  const { type = "profile", id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const isAccessory = 
    profile?.product?.category?.toLowerCase().includes("accessories") || 
    profile?.product?.category?.toLowerCase().includes("bracelet") ||
    profile?.productCategory?.toLowerCase().includes("accessories") || 
    profile?.productCategory?.toLowerCase().includes("bracelet") ||
    profile?.category?.toLowerCase().includes("accessories") ||
    profile?.category?.toLowerCase().includes("bracelet") ||
    profile?.product?.name?.toLowerCase().includes("bracelet") ||
    profile?.name?.toLowerCase().includes("bracelet") ||
    (profile?.productId && profile?.product);

  useEffect(() => {
    fetchData();
    if (type === "profile") {
      fetchSocialLinks();
    }
  }, [id, type]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Keyboard shortcuts (Ctrl+S to save)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (hasUnsavedChanges) {
          handleSaveChanges();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hasUnsavedChanges, profile]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const endpoint = type === "profile" 
        ? `${API_URL}/api/profiles/${id}`
        : `${API_URL}/api/user-products/${id}`;

      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 404) {
          Swal.fire({
            icon: "error",
            title: "Not Found",
            text: "Profile doesn't exist or has been deleted",
            confirmButtonColor: "#0066ff",
          }).then(() => navigate("/dashboard/profiles"));
          return;
        }
        
        if (response.status === 403) {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "You don't have permission to edit this profile",
            confirmButtonColor: "#0066ff",
          }).then(() => navigate("/dashboard/profiles"));
          return;
        }
        
        throw new Error("Failed to load profile");
      }

      const data = await response.json();
      
      let profileData;
      if (type === "profile") {
        profileData = data.data;
      } else {
        const up = data.data;
        profileData = {
          ...up,
          id: up.id,
          name: up.nickname || up.product?.name,
          title: up.profileData?.businessName || "",
          bio: up.profileData?.desc || "",
          url: up.profileData?.url || "",
          avatarUrl: up.image || up.product?.image || null,
          color: up.profileData?.color || "#060640",
          template: up.profileData?.template || "default",
          // Sync page design helpers for products
          pageTemplate: up.profileData?.template || "default",
          pageColor: up.profileData?.color || "#060640",
          
          type: "user-product",
          productType: up.productType,
          platform: up.platform || up.product?.platform,
        };
      }
      
      setProfile(profileData);
      setOriginalProfile(JSON.parse(JSON.stringify(profileData)));
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to load profile",
        confirmButtonColor: "#0066ff",
      });
      navigate("/dashboard/profiles");
    } finally {
      setLoading(false);
    }
  };

  const fetchSocialLinks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/social-links/profile/${id}?includeHidden=true`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      setSocialLinks(data.data || []);
    } catch (error) {
      console.error("Error fetching social links:", error);
    }
  };

  // Track profile changes
  const updateProfile = (updates) => {
    setHasUnsavedChanges(true);
    setProfile(prev => ({
      ...prev,
      ...updates,
      profileData: {
        ...(prev.profileData || {}),
        ...(updates.profileData || {})
      }
    }));
  };

  // Unified save function
  const handleSaveChanges = async () => {
    // Validation
    if (!profile.name?.trim()) {
      Swal.fire({
        icon: "error",
        title: "Missing Required Field",
        text: "Name cannot be empty",
        confirmButtonColor: "#0066ff",
      });
      return;
    }

    // Additional validation for menu products
    if (profile.productType === "menu" && activeTab === "menu") {
      if (!profile.profileData?.categories || profile.profileData.categories.length === 0) {
        const result = await Swal.fire({
          icon: "warning",
          title: "No Menu Items",
          text: "Your menu has no categories. Save anyway?",
          showCancelButton: true,
          confirmButtonText: "Yes, save anyway",
          confirmButtonColor: "#0066ff",
        });
        if (!result.isConfirmed) return;
      }
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      
      if (type === "profile") {
        const formData = new FormData();
        formData.append("name", profile.name);
        formData.append("title", profile.title || "");
        formData.append("bio", profile.bio || "");
        formData.append("color", profile.color);
        formData.append("template", profile.template);
        
        // Page Design
        if (profile.pageTemplate) formData.append("pageTemplate", profile.pageTemplate);
        if (profile.pageColor) formData.append("pageColor", profile.pageColor);

        // Design mode handling
        if (profile.designMode) {
          formData.append("designMode", profile.designMode);
        }
        
        if (profile.designMode === "ai" && profile.aiBackground) {
          formData.append("aiBackground", profile.aiBackground);
          formData.append("aiPrompt", profile.aiPrompt || "");
        } else if (profile.customDesignUrl) {
          formData.append("customDesignUrl", profile.customDesignUrl);
        }

        if (profile.avatarFile) formData.append("avatar", profile.avatarFile);
        if (!profile.avatarUrl && !profile.avatarFile) formData.append("removeAvatar", "true");

        const response = await fetch(`${API_URL}/api/profiles/${id}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to update profile");
        }

        // Explicitly update Page Design settings using PATCH
        // This ensures compatibility if the PUT endpoint doesn't handle these specific fields
        if (profile.pageTemplate || profile.pageColor) {
          await fetch(`${API_URL}/api/profiles/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              pageTemplate: profile.pageTemplate,
              pageColor: profile.pageColor
            }),
          });
        }
        
        if (data.success) {
          setHasUnsavedChanges(false);
          setOriginalProfile(JSON.parse(JSON.stringify(profile)));
          
          Swal.fire({
            icon: "success",
            title: "Saved!",
            text: "Profile updated successfully!",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => fetchData());
        }
      } else {
        // For User Products
        const updateBody = {
          nickname: profile.name,
          profileData: {
            ...profile.profileData,
            url: profile.url,
            platform: profile.platform,
            businessName: profile.productType === "review" ? profile.title : undefined,
            desc: profile.bio || "",
            // Use pageTemplate/pageColor for products as the main template/color
            color: profile.pageColor || profile.color,
            template: profile.pageTemplate || profile.template,
          },
          setupComplete: true
        };

        const response = await fetch(`${API_URL}/api/user-products/${id}/setup`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateBody),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to update");
        }
        
        if (data.success) {
          setHasUnsavedChanges(false);
          setOriginalProfile(JSON.parse(JSON.stringify(profile)));
          
          Swal.fire({
            icon: "success",
            title: "Saved!",
            text: "Product settings updated successfully.",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => fetchData());
        }
      }
    } catch (error) {
      console.error("Error updating:", error);
      Swal.fire({ 
        icon: "error", 
        title: "Failed", 
        text: error.message || "Error saving changes",
        confirmButtonColor: "#0066ff",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    Swal.fire({
      icon: "warning",
      title: "Discard Changes?",
      text: "All unsaved changes will be lost",
      showCancelButton: true,
      confirmButtonText: "Yes, discard",
      confirmButtonColor: "#dc2626",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setProfile(JSON.parse(JSON.stringify(originalProfile)));
        setHasUnsavedChanges(false);
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    updateProfile({ avatarUrl: url, avatarFile: file });
  };

  const handleImageRemove = () => {
    Swal.fire({
      title: "Remove Profile Image?",
      text: "Your profile image will be removed when you save changes.",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#060640",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Remove",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        updateProfile({ avatarUrl: null, avatarFile: null });
      }
    });
  };

  const buildFinalLink = (platform, value) => {
    const username = value.trim();

    if (username.startsWith("http://") || username.startsWith("https://")) {
      return username;
    }

    switch (platform) {
      case "instagram":
        return `https://instagram.com/${username}`;
      case "linkedin":
        return `https://linkedin.com/in/${username}`;
      case "twitter":
        return `https://twitter.com/${username}`;
      case "github":
        return `https://github.com/${username}`;
      case "facebook":
        return `https://facebook.com/${username}`;
      case "website":
        return `https://${username}`;
      default:
        return username;
    }
  };

  const handleAddSocialLink = async (platform, url) => {
    try {
      const token = localStorage.getItem("token");
      const finalUrl = buildFinalLink(platform, url);

      const response = await fetch(`${API_URL}/api/social-links`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId: id,
          platform,
          url: finalUrl,
        }),
      });

      if (response.ok) {
        fetchSocialLinks();
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Social link added successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error adding social link:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add social link.",
      });
    }
  };

  const handleEditSocialLink = async (linkId, platform, url) => {
    try {
      const token = localStorage.getItem("token");
      const finalUrl = buildFinalLink(platform, url);

      const response = await fetch(`${API_URL}/api/social-links/${linkId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: finalUrl }),
      });

      if (response.ok) {
        fetchSocialLinks();
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Social link updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error("Error editing social link:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update social link.",
      });
    }
  };

  const handleOpenEditModal = (link) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
  };

  const handleDeleteSocialLink = async (linkId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Delete this social link?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/api/social-links/${linkId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setSocialLinks(socialLinks.filter((link) => link.id !== linkId));

      Swal.fire({
        title: "Deleted!",
        text: "The social link has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting social link:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to delete social link.",
        icon: "error",
      });
    }
  };

  const handleToggleLinkVisibility = async (linkId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/api/social-links/${linkId}/toggle-visibility`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      setSocialLinks(
        socialLinks.map((link) =>
          link.id === linkId ? { ...link, isVisible: !link.isVisible } : link
        )
      );
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      Swal.fire({
        icon: "success",
        title: "Copied!",
        text: "Link copied to clipboard!",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch (err) {
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
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Loading profile..." />;
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-12 h-12 text-gray-400" />
        </div>
        <p className="text-xl font-semibold text-gray-900 mb-2">
          Profile not found
        </p>
        <p className="text-gray-600 mb-6">
          The profile you're looking for doesn't exist
        </p>
        <button
          onClick={() => navigate("/dashboard/profiles")}
          className="btn-primary-clean px-6 py-3"
        >
          Back to Profiles
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <EditProfileHeader
          profile={profile}
          onBack={() => navigate("/dashboard/profiles")}
          onCopyLink={copyToClipboard}
        />

        {/* Action Bar with Save Status */}
        <div className="flex items-center justify-between px-4 sm:px-0 gap-4">
          {/* Save Status Indicator */}
          <div className="flex items-center gap-3">
            {hasUnsavedChanges ? (
              <span className="text-sm text-amber-600 font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                Unsaved changes
              </span>
            ) : (
              <span className="text-sm text-green-600 font-medium flex items-center gap-2">
                <Check className="w-4 h-4" />
                All changes saved
              </span>
            )}
            
            <p className="text-xs text-gray-500 hidden md:block">
              💡 Press <kbd className="px-2 py-0.5 bg-gray-100 rounded border text-[10px]">Ctrl+S</kbd> to save
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <button
                onClick={handleDiscardChanges}
                className="px-4 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all text-sm flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Discard</span>
              </button>
            )}
            
            <button
              onClick={handleSaveChanges}
              disabled={saving || !hasUnsavedChanges}
              className="px-6 py-2.5 rounded-xl bg-brand-primary text-white font-bold shadow-lg shadow-brand-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> 
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        <EditProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          socialLinksCount={socialLinks.length}
          isUserProduct={type === "user-product"}
          productType={profile?.productType}
          menuItemsCount={profile?.profileData?.categories?.reduce((acc, cat) => acc + (cat.items?.length || 0), 0) || 0}
          isAccessory={isAccessory}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "basic" && (
              <BasicInfoForm
                profile={profile}
                setProfile={updateProfile}
                saving={saving}
                onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }}
                onImageChange={handleImageChange}
                onImageRemove={handleImageRemove}
                type={type}
              />
            )}

            {activeTab === "design" && (
              <DesignEditorTab
                profile={profile}
                setProfile={updateProfile}
                saving={saving}
                onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }}
                type={type}
                isAccessory={isAccessory}
              />
            )}

            {activeTab === "links" && !loading && (
              <SocialLinksTab
                socialLinks={socialLinks}
                onAddLink={handleOpenAddModal}
                onEditLink={handleOpenEditModal}
                onToggleVisibility={handleToggleLinkVisibility}
                onDelete={handleDeleteSocialLink}
              />
            )}

            {activeTab === "menu" && (
              <MenuEditorTab
                profile={profile}
                setProfile={updateProfile}
              />
            )}

            {activeTab === "settings" && (
              <SettingsTab
                profile={profile}
                onCopyLink={copyToClipboard}
                onAccountDeleted={() => navigate("/")}
              />
            )}
          </div>

          {/* Sidebar */}
          <ProfileSidebar
            profile={profile}
            socialLinks={socialLinks}
            onCopyLink={copyToClipboard}
            onNavigate={navigate}
            isAccessory={isAccessory}
          />
        </div>

        <SocialLinkModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAdd={handleAddSocialLink}
          onEdit={handleEditSocialLink}
          editingLink={editingLink}
          existingPlatforms={socialLinks.map((link) => link.platform)}
        />
      </div>
    </>
  );
}