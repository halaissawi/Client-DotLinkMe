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
}) {
  const [cropModal, setCropModal] = useState({
    open: false,
    imageSrc: null,
  });
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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
              Basic Information
            </h2>
            <p className="text-sm text-gray-600">Update your profile details</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Image */}
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
                    {/* Remove button - shows on hover */}
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
                {!profile.avatarUrl && (
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-white" />
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
                  {profile.avatarUrl && (
                    <button
                      type="button"
                      onClick={onImageRemove}
                      className="px-6 py-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-all inline-flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Remove Image
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: Square image (1:1 ratio), max 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {profile.profileType === "personal"
                ? "Full Name"
                : "Company Name"}
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all"
              placeholder="Enter name"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {profile.profileType === "personal" ? "Title / Role" : "Industry"}
            </label>
            <input
              type="text"
              value={profile.title || ""}
              onChange={(e) =>
                setProfile({ ...profile, title: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all"
              placeholder={
                profile.profileType === "personal"
                  ? "e.g. Software Engineer"
                  : "e.g. Technology & Innovation"
              }
            />
          </div>

          {/* Bio */}
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
