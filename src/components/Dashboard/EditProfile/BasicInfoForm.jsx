import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
  Edit3,
  User,
  Building,
  Upload,
  Save,
  Image as ImageIcon,
  X,
} from "lucide-react";

export default function BasicInfoForm({
  profile,
  setProfile,
  saving,
  onSubmit,
  onImageChange,
  onImageRemove,
  type = "profile"
}) {
  const [cropModal, setCropModal] = useState({
    open: false,
    imageSrc: null,
  });
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const isProfile = type === "profile";
  const isReview = profile.productType === "review";
  const isSocial = profile.productType === "social_link";
  const isMenu = profile.productType === "menu";

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setCropModal({
          open: true,
          imageSrc: reader.result,
        });
      });
      reader.readAsDataURL(file);
    }
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(null);
          return;
        }
        const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
        resolve(file);
      }, "image/jpeg");
    });
  };

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(
        cropModal.imageSrc,
        croppedAreaPixels
      );
      if (croppedImage) {
        const fakeEvent = {
          target: {
            files: [croppedImage],
          },
        };
        onImageChange(fakeEvent);
      }
      setCropModal({ open: false, imageSrc: null });
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCropCancel = () => {
    setCropModal({ open: false, imageSrc: null });
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6"
        style={{
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        }}
      >
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-blue-600 flex items-center justify-center">
            <Edit3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-brand-dark">
              {isProfile ? "Basic Information" : `${profile.productType?.replace('_', ' ').toUpperCase()} Settings`}
            </h2>
            <p className="text-sm text-gray-600">Update your {isProfile ? 'profile' : 'card'} details</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Image (Only show for Profiles or specific products if they have icons) */}
          {isProfile && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Profile Image
              </label>
              <div className="flex items-center gap-6">
                <div className="relative group">
                  {profile.avatarUrl ? (
                    <>
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className={`w-24 h-24 object-cover ring-4 ring-gray-100 group-hover:ring-brand-primary/50 transition-all ${
                          profile.profileType === "personal"
                            ? "rounded-full"
                            : "rounded-2xl"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={onImageRemove}
                        className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                        title="Remove image"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </>
                  ) : (
                    <div
                      className={`w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl ring-4 ring-gray-100 group-hover:ring-brand-primary/50 transition-all ${
                        profile.profileType === "personal"
                          ? "rounded-full"
                          : "rounded-2xl"
                      }`}
                    >
                      {profile.profileType === "personal" ? (
                        <User className="w-5 h-5" />
                      ) : (
                        <Building className="w-5 h-5" />
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    <label className="btn-ghost-clean px-6 py-3 cursor-pointer inline-flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      {profile.avatarUrl ? "Change Image" : "Upload New Image"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Name / Nickname */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {isProfile 
                ? (profile.profileType === "personal" ? "Full Name" : "Company Name")
                : (isReview ? "Business Name" : "Card Nickname")}
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all font-medium"
              placeholder={isProfile ? "Enter name" : "e.g. My Instagram Card"}
            />
          </div>

          {/* URL / Link (For Products) */}
          {!isProfile && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {isReview ? "Google Review URL" : (isMenu ? "Menu / Website URL" : "Your Profile URL")}
              </label>
              <input
                type="url"
                value={profile.url || ""}
                onChange={(e) => setProfile({ ...profile, url: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all font-medium"
                placeholder="https://..."
              />
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2 px-1">
                This is where the NFC scan will redirect people
              </p>
            </div>
          )}

          {/* Title (Only for Profile or Review) */}
          {(isProfile || isReview) && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {isProfile 
                  ? (profile.profileType === "personal" ? "Title / Role" : "Industry")
                  : "Google Maps Business ID (Optional)"}
              </label>
              <input
                type="text"
                value={profile.title || ""}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all"
                placeholder={isProfile ? "e.g. Software Engineer" : "Your place ID"}
              />
            </div>
          )}

          {/* Bio (Only for Profile) */}
          {isProfile && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio / Description
              </label>
              <textarea
                rows={5}
                value={profile.bio || ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all resize-none"
                placeholder="Tell people about yourself or your business..."
              />
              <p className="text-xs text-gray-500 mt-2">
                {profile.bio?.length || 0} / 500 characters
              </p>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="btn-accent w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-semibold"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>

      {cropModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Crop Profile Image
              </h3>
            </div>
            <div className="relative h-96 bg-gray-100">
              <Cropper
                image={cropModal.imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zoom
                </label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCropCancel}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropSave}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-primary to-blue-600 text-white hover:shadow-lg rounded-xl font-medium transition-all"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
