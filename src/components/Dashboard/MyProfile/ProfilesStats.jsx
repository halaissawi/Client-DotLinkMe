import React from "react";

export default function ProfilesStats({ profiles }) {
  const stats = [
    {
      label: "Total Products",
      value: profiles.length,
      color: "text-brand-dark",
    },
    {
      label: "Active Items",
      value: profiles.filter((p) => p.isActive).length,
      color: "text-green-600",
    },
    {
      label: "Total Views",
      value: profiles.reduce((sum, p) => sum + (p.viewCount || 0), 0),
      color: "text-blue-600",
    },
    {
      label: "Cards & Tools",
      value: profiles.length,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-4 rounded-xl border border-gray-200 bg-white"
          style={{
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          }}
        >
          <p className="text-sm text-gray-600">{stat.label}</p>
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
