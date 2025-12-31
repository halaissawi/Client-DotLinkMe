import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import EditProfileHeader from "../../components/Dashboard/EditProfile/EditProfileHeader";
import EditProfileTabs from "../../components/Dashboard/EditProfile/EditProfileTabs";
import BasicInfoForm from "../../components/Dashboard/EditProfile/BasicInfoForm";
import DesignEditorTab from "../../components/Dashboard/EditProfile/DesignEditorTab";
import SocialLinksTab from "../../components/Dashboard/EditProfile/SocialLinksTab";
import SettingsTab from "../../components/Dashboard/EditProfile/SettingsTab";
import ProfileSidebar from "../../components/Dashboard/EditProfile/ProfileSidebar";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import SocialLinkModal from "../../components/SocialLinkModal"; // ✅ Renamed from AddSocialLinkModal
import { X } from "lucide-react";

export default function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null); // ✅ NEW: Track which link is being edited
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProfile();
    fetchSocialLinks();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/profiles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setProfile(data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("name", profile.name);
      formData.append("title", profile.title || "");
      formData.append("bio", profile.bio || "");
      formData.append("color", profile.color);
      formData.append("template", profile.template);

      // Only append avatar if there's a new file
      if (profile.avatarFile) {
        formData.append("avatar", profile.avatarFile);
      }

      // Signal avatar removal if avatarUrl is null but original profile had one
      if (!profile.avatarUrl && !profile.avatarFile) {
        formData.append("removeAvatar", "true");
      }

      const response = await fetch(`${API_URL}/api/profiles/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Profile updated successfully!",
          confirmButtonColor: "#060640",
        }).then(() => fetchProfile());
      } else {
        const errorMessage = data.error
          ? data.error.replace(/^Validation error:\s*/i, "")
          : data.message || "Error updating profile";

        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: errorMessage,
          confirmButtonColor: "#060640",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Error updating profile",
        confirmButtonColor: "#060640",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateDesign = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const updateData = {
        color: profile.color,
        template: profile.template,
        designMode: profile.designMode || "manual",
      };

      if (profile.designMode === "ai" && profile.aiBackground) {
        updateData.aiBackground = profile.aiBackground;
        updateData.aiPrompt = profile.aiPrompt || "";
        updateData.customDesignUrl = null;
      } else if (profile.customDesignUrl) {
        updateData.customDesignUrl = profile.customDesignUrl;
        updateData.aiBackground = null;
        updateData.aiPrompt = null;
      } else {
        updateData.customDesignUrl = null;
        updateData.aiBackground = null;
        updateData.aiPrompt = null;
      }

      const response = await fetch(`${API_URL}/api/profiles/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Design Updated",
          text: "Card design updated successfully!",
          confirmButtonColor: "#060640",
        }).then(() => {
          fetchProfile();
        });
      } else {
        const errorMessage = data.error
          ? data.error.replace(/^Validation error:\s*/i, "")
          : data.message || "Error updating design";

        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: errorMessage,
          confirmButtonColor: "#060640",
        });
      }
    } catch (error) {
      console.error("Error updating design:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Error updating design",
        confirmButtonColor: "#060640",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setProfile({ ...profile, avatarUrl: url, avatarFile: file });
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
        setProfile({ ...profile, avatarUrl: null, avatarFile: null });
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

  // ✅ NEW: Handle editing social link
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
        body: JSON.stringify({
          url: finalUrl,
        }),
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

  // ✅ NEW: Open modal for editing
  const handleOpenEditModal = (link) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  // ✅ NEW: Open modal for adding
  const handleOpenAddModal = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };

  // ✅ NEW: Close modal and reset editing state
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

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
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

  if (loading) {
    return <LoadingSpinner fullPage text="Loading profile..." />;
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="w-12 h-12 text-gray-400" />
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

        <EditProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          socialLinksCount={socialLinks.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "basic" && (
              <BasicInfoForm
                profile={profile}
                setProfile={setProfile}
                saving={saving}
                onSubmit={handleUpdateProfile}
                onImageChange={handleImageChange}
                onImageRemove={handleImageRemove}
              />
            )}

            {activeTab === "design" && (
              <DesignEditorTab
                profile={profile}
                setProfile={setProfile}
                saving={saving}
                onSubmit={handleUpdateDesign}
              />
            )}

            {activeTab === "links" && (
              <SocialLinksTab
                socialLinks={socialLinks}
                onAddLink={handleOpenAddModal} // ✅ Updated
                onEditLink={handleOpenEditModal} // ✅ NEW
                onToggleVisibility={handleToggleLinkVisibility}
                onDelete={handleDeleteSocialLink}
              />
            )}

            {activeTab === "settings" && (
              <SettingsTab
                profile={profile}
                onCopyLink={copyToClipboard}
                onAccountDeleted={() => {
                  // Redirect to home or login page
                  navigate("/");
                }}
              />
            )}
          </div>

          {/* Sidebar */}
          <ProfileSidebar
            profile={profile}
            socialLinks={socialLinks}
            onCopyLink={copyToClipboard}
            onNavigate={navigate}
          />
        </div>

        {/* ✅ Updated Modal with edit support */}
        <SocialLinkModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAdd={handleAddSocialLink}
          onEdit={handleEditSocialLink} // ✅ NEW
          editingLink={editingLink} // ✅ NEW
          existingPlatforms={socialLinks.map((link) => link.platform)}
        />
      </div>
    </>
  );
}
