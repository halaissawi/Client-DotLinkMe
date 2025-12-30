import React from "react";
import { formatDate } from "../../../utils/helpers";
import { User, Building, Clock } from "lucide-react";

export default function RecentActivity({ activities }) {
  return (
    <div className="lg:col-span-1">
      <div className="card-glass p-6 h-full">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-6 h-6 text-brand-primary" />
          <h2 className="text-xl font-bold text-brand-dark">Recent Activity</h2>
        </div>

        {/* Empty state */}
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3 text-gray-400">
              <Clock className="w-10 h-10 mx-auto" />
            </div>
            <p className="text-sm text-gray-500">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {/* Profile Type Icon */}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activity.profileType === "personal"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {activity.profileType === "personal" ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Building className="w-5 h-5" />
                  )}
                </div>

                {/* Activity Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-dark truncate">
                    {activity.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Updated {formatDate(activity.updatedAt)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">
                      {activity.viewCount || 0} views
                    </span>
                    {activity.isActive && (
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
