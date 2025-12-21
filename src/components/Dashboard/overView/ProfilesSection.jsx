import React from "react";
import { Link } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import { Users, ArrowRight, Plus } from "lucide-react";

export default function ProfilesSection({ profiles }) {
   return (
    <div className="lg:col-span-2">
      <div className="card-glass p-6 md:p-8 h-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-brand-dark flex items-center gap-2">
              <Users className="w-6 h-6 text-brand-primary" />
              Your Profiles
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage and track your digital cards
            </p>
          </div>
          <Link
            to="/dashboard/profiles"
            className="text-sm font-medium text-brand-primary hover:text-blue-600 transition-colors flex items-center gap-1 group"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {profiles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-brand-primary/10 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-brand-primary" />
            </div>
            <h3 className="text-2xl font-bold text-brand-dark mb-3">
              No profiles yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first smart digital card and start connecting with
              people in a whole new way
            </p>
            <Link
              to="/create-card"
              className="btn-primary-clean px-8 py-4 inline-flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create Your First Profile
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profiles.slice(0, 4).map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
