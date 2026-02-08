import React from "react";
import StatCard from "./StatCard";
import { User, Eye, MousePointerClick, CheckCircle } from "lucide-react";

export default function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={<User className="w-7 h-7" />}
        label="Total Products"
        value={stats?.totalProfiles || 0}
        bgColor="bg-gradient-to-br from-brand-primary to-blue-600 text-white"
        gradient={true}
      />
      <StatCard
        icon={<Eye className="w-7 h-7" />}
        label="Total Views"
        value={stats?.totalViews || 0}
        bgColor="bg-gradient-to-br from-green-500 to-emerald-600 text-white"
      />
      <StatCard
        icon={<MousePointerClick className="w-7 h-7" />}
        label="Total Clicks"
        value={stats?.totalClicks || 0}
        bgColor="bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
      />
      <StatCard
        icon={<CheckCircle className="w-7 h-7" />}
        label="Active Products"
        value={stats?.activeProfiles || 0}
        bgColor="bg-gradient-to-br from-purple-500 to-pink-600 text-white"
      />
    </div>
  );
}
