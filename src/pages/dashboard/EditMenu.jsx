import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { 
  ArrowLeft, 
  ExternalLink, 
  Share2, 
  Save, 
  Settings, 
  Palette, 
  UtensilsCrossed, 
  Edit3,
  Globe,
  QrCode,
  AlertTriangle,
  Check,
  X
} from "lucide-react";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import StepBasics from "../../components/MenuBuilder/StepBasics";
import StepMenuItems from "../../components/MenuBuilder/StepMenuItems";
import StepDesign from "../../components/MenuBuilder/StepDesign";
import { QRCodeCanvas } from "qrcode.react";
import EditProfileHeader from "../../components/Dashboard/EditProfile/EditProfileHeader";

const INITIAL_MENU_DATA = {
  restaurantName: "",
  tagline: "",
  cuisineType: "",
  logo: null,
  coverImage: null,
  phone: "",
  email: "",
  address: "",
  website: "",
  categories: [],
  theme: {
    primaryColor: "#f2a91d",
    layout: "modern",
    fontFamily: "Inter",
  },
  social: {
    facebook: "",
    instagram: "",
    twitter: "",
  },
};

export default function EditMenu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(INITIAL_MENU_DATA);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchMenuData();
  }, [id]);

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleUpdateMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [formData, hasUnsavedChanges]);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/menus/id/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Handle different error statuses
      if (!res.ok) {
        if (res.status === 404) {
          Swal.fire({
            icon: "error",
            title: "Menu Not Found",
            text: "This menu doesn't exist or has been deleted",
            confirmButtonColor: "#0066ff",
          }).then(() => navigate("/dashboard/profiles"));
          return;
        }
        
        if (res.status === 403) {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "You don't have permission to edit this menu",
            confirmButtonColor: "#0066ff",
          }).then(() => navigate("/dashboard/profiles"));
          return;
        }
        
        throw new Error("Failed to load menu data");
      }
      
      const data = await res.json();
      
      if (data.success) {
        setFormData({
          ...INITIAL_MENU_DATA,
          ...data.data,
          theme: {
            ...INITIAL_MENU_DATA.theme,
            ...(data.data.theme || {}),
          },
          social: {
            ...INITIAL_MENU_DATA.social,
            ...(data.data.social || {}),
          },
        });
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
      Swal.fire({ 
        icon: "error", 
        title: "Error", 
        text: error.message || "Could not load menu",
        confirmButtonColor: "#0066ff",
      });
      navigate("/dashboard/profiles");
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (updates) => {
    setHasUnsavedChanges(true);
    setFormData((prev) => ({
      ...prev,
      ...updates,
      theme: {
        ...(prev.theme || {}),
        ...(updates.theme || {}),
      },
      social: {
        ...(prev.social || {}),
        ...(updates.social || {}),
      },
    }));
  };

  const handleUpdateMenu = async () => {
    // Validation
    if (!formData.restaurantName?.trim()) {
      Swal.fire({
        icon: "error",
        title: "Missing Required Field",
        text: "Restaurant name cannot be empty",
        confirmButtonColor: "#0066ff",
      });
      return;
    }

    if (!formData.categories || formData.categories.length === 0) {
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

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/menus/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setHasUnsavedChanges(false);
        Swal.fire({
          icon: "success",
          title: "Saved!",
          text: "Menu updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        const data = await res.json();
        throw new Error(data.message || "Failed to update");
      }
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire({ 
        icon: "error", 
        title: "Error", 
        text: err.message,
        confirmButtonColor: "#0066ff",
      });
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = async () => {
    const url = `${window.location.origin}/menu/${formData.uniqueSlug}`;
    try {
      await navigator.clipboard.writeText(url);
      Swal.fire({
        icon: "success",
        title: "Copied!",
        text: "Link copied to clipboard.",
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch (err) {
      console.error("Copy failed:", err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not copy link. Please try manually.",
        timer: 2000,
        toast: true,
        position: "top-end",
      });
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
        fetchMenuData();
        setHasUnsavedChanges(false);
      }
    });
  };

  const handleDeleteMenu = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Menu?",
      html: `
        <p>Are you sure you want to delete <strong>${formData.restaurantName}</strong>?</p>
        <p class="text-sm text-gray-600 mt-2">This action cannot be undone.</p>
      `,
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      confirmButtonColor: "#dc2626",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/menus/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Menu has been deleted",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => navigate("/dashboard/profiles"));
        } else {
          const data = await res.json();
          throw new Error(data.message || "Failed to delete menu");
        }
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message,
          confirmButtonColor: "#0066ff",
        });
      }
    }
  };

  const handleDownloadQR = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      Swal.fire({
        icon: "error",
        title: "QR Code Not Found",
        text: "Please try refreshing the page",
        confirmButtonColor: "#0066ff",
      });
      return;
    }
    
    try {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.download = `${formData.restaurantName || 'menu'}-qr-code.png`;
      link.href = url;
      link.click();
    } catch (err) {
      console.error("QR download failed:", err);
      Swal.fire({
        icon: "error",
        title: "Download Failed",
        text: "Could not generate QR code image",
        confirmButtonColor: "#0066ff",
      });
    }
  };

  if (loading) return <LoadingSpinner fullPage text="Loading menu data..." />;

  const tabs = [
    { id: "basic", label: "Basics", icon: Edit3 },
    { id: "items", label: "Menu Items", icon: UtensilsCrossed, count: formData.categories?.reduce((acc, cat) => acc + (cat.items?.length || 0), 0) },
    { id: "design", label: "Design", icon: Palette },
    { id: "social", label: "Social", icon: Globe },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const menuUrl = `${window.location.origin}/menu/${formData.uniqueSlug}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <EditProfileHeader 
        profile={{
          name: formData.restaurantName,
          slug: formData.uniqueSlug,
          type: 'menu',
          profileUrl: menuUrl
        }}
        onBack={() => navigate("/dashboard/profiles")}
        onCopyLink={copyToClipboard}
      />
      
      {/* Action Bar */}
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
            onClick={handleUpdateMenu}
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

      {/* Tabs */}
      <div className="flex gap-2 p-2 bg-white rounded-2xl border border-gray-200 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                isActive 
                  ? "bg-brand-primary text-white shadow-md" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-lg text-[10px] ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-8">
          {activeTab === "basic" && (
            <StepBasics formData={formData} updateFormData={updateFormData} />
          )}

          {activeTab === "items" && (
            <StepMenuItems formData={formData} updateFormData={updateFormData} />
          )}

          {activeTab === "design" && (
            <StepDesign formData={formData} updateFormData={updateFormData} />
          )}

          {activeTab === "social" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Social Media</h2>
                <p className="text-gray-600">Connect your social profiles to your menu</p>
              </div>
              
              <div className="grid gap-6">
                {[
                  { platform: "instagram", label: "Instagram", color: "#E4405F", placeholder: "@yourrestaurant or instagram.com/yourrestaurant" },
                  { platform: "facebook", label: "Facebook", color: "#1877F2", placeholder: "facebook.com/yourrestaurant" },
                  { platform: "twitter", label: "Twitter", color: "#1DA1F2", placeholder: "@yourrestaurant or twitter.com/yourrestaurant" },
                ].map(({ platform, label, color, placeholder }) => (
                  <div key={platform} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}20` }}>
                        <Globe className="w-5 h-5" style={{ color }} />
                      </div>
                      <label className="text-sm font-bold text-gray-700">{label}</label>
                    </div>
                    <input
                      type="text"
                      value={formData.social?.[platform] || ""}
                      onChange={(e) => updateFormData({ social: { ...formData.social, [platform]: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-8">
              {/* QR Code Section */}
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-purple-600" />
                  Your Menu QR Code
                </h3>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <QRCodeCanvas value={menuUrl} size={150} />
                  </div>
                  <div className="space-y-4 text-center md:text-left flex-1">
                    <p className="text-sm text-gray-600">
                      This QR code links directly to your digital menu. Download it to use on your tables, windows, or flyers.
                    </p>
                    <button
                      onClick={handleDownloadQR}
                      className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
                    >
                      Download QR Code
                    </button>
                  </div>
                </div>
              </div>

              {/* Share Link Section */}
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-blue-600" />
                  Share Link
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 bg-white rounded-xl border border-gray-200 font-medium text-gray-600 truncate text-sm">
                    {menuUrl}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="p-3 bg-brand-primary text-white rounded-xl shadow-md hover:scale-105 transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-6 bg-red-50 rounded-2xl border-2 border-red-200">
                <h3 className="text-lg font-bold mb-2 text-red-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Danger Zone
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  Once deleted, this menu and all its data will be permanently removed. This action cannot be undone.
                </p>
                <button
                  onClick={handleDeleteMenu}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Delete Menu Permanently
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Preview Sidebar */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden h-fit sticky top-24">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl" />
            
            <h3 className="text-xl font-black mb-6 relative z-10">Quick Stats</h3>
            
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Total Views</span>
                <span className="font-bold">{formData.viewCount || 0}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Status</span>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                  formData.status === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {formData.status || 'locked'}
                </span>
              </div>

              {formData.updatedAt && (
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-gray-400">Last Updated</span>
                  <span className="font-bold text-sm">
                    {new Date(formData.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-3">
                <span className="text-gray-400">Categories</span>
                <span className="font-bold">{formData.categories?.length || 0}</span>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
              <button
                onClick={() => window.open(menuUrl, '_blank')}
                className="w-full py-3.5 bg-brand-primary text-white rounded-2xl font-black shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink size={18} />
                Preview Live Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}