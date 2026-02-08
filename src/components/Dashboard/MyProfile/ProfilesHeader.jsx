import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function ProfilesHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-primary to-blue-600 bg-clip-text text-transparent">
          My Products
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Manage and track all your digital assets
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard/order-card"
          className="px-6 py-4 bg-purple-50 text-purple-600 rounded-2xl hover:bg-purple-100 transition-all font-semibold flex items-center gap-2"
        >
          Order NFC Card
        </Link>
        <Link
          to="/gallery"
          className="px-6 py-4 border-2 border-brand-primary/20 text-brand-primary rounded-2xl hover:bg-brand-primary/5 transition-all font-semibold flex items-center gap-2"
        >
          Browse Shop
        </Link>
        <Link
          to="/create-card"
          className="btn-primary-clean px-8 py-4 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-semibold">Create Profile</span>
        </Link>
      </div>
    </div>
  );
}
