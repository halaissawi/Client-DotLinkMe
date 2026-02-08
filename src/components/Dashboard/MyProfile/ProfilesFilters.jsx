import {
  LayoutGrid,
  List,
  User,
  Building,
  CheckCircle,
  PauseCircle,  
  BarChart2,
  Share2,
  UtensilsCrossed,
  Star
} from "lucide-react";

export default function ProfilesFilters({
  filter,
  setFilter,
  viewMode,
  setViewMode,
}) {
  const filters = [
    {
      value: "all",
      label: "All Items",
      icon: <BarChart2 className="w-4 h-4" />,
    },
    {
      value: "social_link",
      label: "Social Cards",
      icon: <Share2 className="w-4 h-4" />,
    },
    {
      value: "menu",
      label: "Menus",
      icon: <UtensilsCrossed className="w-4 h-4" />,
    },
    {
      value: "review",
      label: "Reviews",
      icon: <Star className="w-4 h-4" />,
    },
    {
      value: "personal",
      label: "Personal Profiles",
      icon: <User className="w-4 h-4" />,
    },
    {
      value: "business",
      label: "Business Profiles",
      icon: <Building className="w-4 h-4" />,
    },
    {
      value: "active",
      label: "Active",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      value: "inactive",
      label: "Inactive",
      icon: <PauseCircle className="w-4 h-4" />,
    },
  ];

  return (
    <div
      className="p-6 rounded-xl border border-gray-200 bg-white"
      style={{
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                filter === item.value
                  ? "bg-gradient-to-r from-brand-primary to-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "grid"
                ? "bg-white shadow-sm text-brand-primary"
                : "text-gray-600 hover:text-brand-primary"
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "list"
                ? "bg-white shadow-sm text-brand-primary"
                : "text-gray-600 hover:text-brand-primary"
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
