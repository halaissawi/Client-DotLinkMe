import React from "react";
import { User, Building, BarChart2 } from "lucide-react";

export default function ProfilePerformance({ profiles }) {
  return (
    <div className="card-glass p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 className="w-6 h-6 text-brand-primary" />
        <h2 className="text-2xl font-bold text-brand-dark">
          Product Performance
        </h2>
      </div>

      {/* Profiles List */}
      <div className="space-y-3">
        {profiles.map((profile, index) => (
          <div
            key={profile.id}
            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-brand-primary/30 hover:bg-gradient-to-r hover:from-brand-primary/5 hover:to-transparent transition-all group"
          >
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary/10 to-blue-100 flex items-center justify-center text-2xl font-bold text-brand-primary">
                #{index + 1}
              </div>

              {/* Profile Info */}
              <div className="flex items-center gap-3">
                {/* Type Icon */}
                <div className="text-3xl">
                  {profile.type === "business" ? (
                    <Building className="w-6 h-6 text-brand-primary" />
                  ) : (
                    <User className="w-6 h-6 text-brand-primary" />
                  )}
                </div>

                {/* Name and Type */}
                <div>
                  <p className="font-bold text-brand-dark group-hover:text-brand-primary transition-colors">
                    {profile.name}
                  </p>
                  <p className="text-sm text-gray-500 capitalize flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {profile.type}
                  </p>
                </div>
              </div>
            </div>

            {/* Views */}
            <div className="text-right">
              <p className="text-2xl font-bold bg-gradient-to-r from-brand-primary to-blue-600 bg-clip-text text-transparent">
                {profile.views}
              </p>
              <p className="text-xs text-gray-500 font-medium">total views</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
