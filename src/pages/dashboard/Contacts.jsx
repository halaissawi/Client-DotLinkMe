import React, { useState, useEffect, useMemo } from "react";
import {
  Download,
  Search,
  Mail,
  Phone,
  MapPin,
  Monitor,
  Users,
  Smartphone as NfcIcon,
  QrCode,
  Link2,
  Globe,
  Filter,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Contacts() {
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [visitors, setVisitors] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProfile, setFilterProfile] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const itemsPerPage = 20;

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchAllContacts();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when search changes
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, filterProfile]);

  const fetchAllContacts = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/profiles/all-visitors`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setVisitors(data.data.visitors || []);
        setProfiles(data.data.profiles || []);
        setTotalVisitors(data.data.totalVisitors || 0);
      } else {
        setError("Failed to load contacts");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setError("Unable to fetch contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtered visitors for performance
  const filteredVisitors = useMemo(() => {
    return visitors.filter((visitor) => {
      const matchesSearch =
        visitor.visitorEmail
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        visitor.visitorPhone?.includes(searchTerm) ||
        visitor.visitorCountry
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesProfile =
        filterProfile === "all" ||
        (filterProfile === "deleted" && !visitor.profileId) ||
        visitor.profileId?.toString() === filterProfile;

      return matchesSearch && matchesProfile;
    });
  }, [visitors, searchTerm, filterProfile]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVisitors = filteredVisitors.slice(startIndex, endIndex);

  const exportToCSV = async () => {
    try {
      setExportLoading(true);
      const headers = [
        "Email",
        "Phone",
        "Country",
        "City",
        "Device",
        "Browser",
        "Source",
        "Profile",
        "Date",
      ];

      const csvData = filteredVisitors.map((visitor) => [
        visitor.visitorEmail || "N/A",
        visitor.visitorPhone || "N/A",
        visitor.visitorCountry || "Unknown",
        visitor.visitorCity || "Unknown",
        visitor.device || "Unknown",
        visitor.browser || "Unknown",
        visitor.viewSource || "Unknown",
        visitor.profile?.name || "Deleted Profile",
        new Date(visitor.submittedAt).toLocaleString(),
      ]);

      const csv = [
        headers.join(","),
        ...csvData.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `linkme-contacts-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export contacts. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case "nfc":
        return <NfcIcon className="w-3 h-3" />;
      case "qr":
        return <QrCode className="w-3 h-3" />;
      case "link":
        return <Link2 className="w-3 h-3" />;
      default:
        return <Globe className="w-3 h-3" />;
    }
  };

  const getSourceLabel = (source) => {
    return source === "nfc"
      ? "NFC"
      : source === "qr"
      ? "QR"
      : source === "link"
      ? "Link"
      : "Direct";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{error}</h3>
          <button
            onClick={fetchAllContacts}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-primary to-blue-600 bg-clip-text text-transparent">
          Contacts
        </h1>
        <p className="text-gray-600 mt-2 text-base md:text-lg">
          All visitor contacts from your profiles
        </p>
      </div>

      {/* Stats Card */}
      <div className="card-glass p-4 md:p-6">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-brand-dark">
              {totalVisitors}
            </p>
            <p className="text-gray-600 text-sm md:text-base">Total Contacts</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="card-glass p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label
              htmlFor="search-contacts"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Search Contacts
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="search-contacts"
                type="text"
                placeholder="Search by email, phone, or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search contacts by email, phone, or country"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              />
            </div>
          </div>

          {/* Filter by Profile */}
          <div>
            <label
              htmlFor="filter-profile"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Filter by Profile
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                id="filter-profile"
                value={filterProfile}
                onChange={(e) => setFilterProfile(e.target.value)}
                aria-label="Filter contacts by profile"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/40 appearance-none bg-white"
              >
                <option value="all">All Profiles</option>
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id.toString()}>
                    {profile.name} ({profile.profileType})
                  </option>
                ))}
                <option value="deleted">Deleted Profiles</option>
              </select>
            </div>
          </div>
        </div>

        {/* Export Button */}
        {filteredVisitors.length > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={exportToCSV}
              disabled={exportLoading}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {exportLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export CSV ({filteredVisitors.length} contacts)
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {paginatedVisitors.length > 0 ? (
          paginatedVisitors.map((visitor) => (
            <div key={visitor.id} className="card-glass p-4">
              {/* Contact Info */}
              <div className="mb-3 space-y-2">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <a
                    href={`mailto:${visitor.visitorEmail}`}
                    className="text-brand-primary text-sm break-all hover:underline"
                  >
                    {visitor.visitorEmail || "N/A"}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <a
                    href={`tel:${visitor.visitorPhone}`}
                    className="text-gray-600 text-sm hover:text-brand-primary"
                  >
                    {visitor.visitorPhone || "N/A"}
                  </a>
                </div>
              </div>

              {/* Profile */}
              <div className="mb-3">
                {visitor.profile ? (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-brand-primary">
                        {visitor.profile.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {visitor.profile.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {visitor.profile.profileType}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm italic">Deleted Profile</span>
                  </div>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-3 text-xs text-gray-600 pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  {visitor.visitorCity || "Unknown"},{" "}
                  {visitor.visitorCountry || "Unknown"}
                </span>
                <span className="flex items-center gap-1">
                  <Monitor className="w-3 h-3 flex-shrink-0" />
                  {visitor.device || "Unknown"}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">
                  {getSourceIcon(visitor.viewSource)}
                  {getSourceLabel(visitor.viewSource)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  {new Date(visitor.submittedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="card-glass p-8 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {searchTerm || filterProfile !== "all"
                ? "No contacts match your filters"
                : "No contacts yet"}
            </h3>
            <p className="text-gray-600 text-sm">
              {searchTerm || filterProfile !== "all"
                ? "Try adjusting your search or filters"
                : "When people share their contact info with you, they'll appear here"}
            </p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="card-glass p-4 md:p-6 hidden md:block">
        {paginatedVisitors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Contact Info
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Profile
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Location
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Device
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Source
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedVisitors.map((visitor) => (
                  <tr
                    key={visitor.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <a
                            href={`mailto:${visitor.visitorEmail}`}
                            className="text-brand-primary hover:underline"
                          >
                            {visitor.visitorEmail || "N/A"}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <a
                            href={`tel:${visitor.visitorPhone}`}
                            className="hover:text-brand-primary"
                          >
                            {visitor.visitorPhone || "N/A"}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {visitor.profile ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-brand-primary">
                              {visitor.profile.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {visitor.profile.name}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {visitor.profile.profileType}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-500">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm italic">
                            Deleted Profile
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>
                          {visitor.visitorCity || "Unknown"},{" "}
                          {visitor.visitorCountry || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Monitor className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <div>{visitor.device || "Unknown"}</div>
                          <div className="text-xs text-gray-500">
                            {visitor.browser || "Unknown"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {getSourceIcon(visitor.viewSource)}
                        {getSourceLabel(visitor.viewSource)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div>
                          {new Date(visitor.submittedAt).toLocaleDateString()}
                          <br />
                          <span className="text-xs text-gray-500">
                            {new Date(visitor.submittedAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {searchTerm || filterProfile !== "all"
                ? "No contacts match your filters"
                : "No contacts yet"}
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterProfile !== "all"
                ? "Try adjusting your search or filters"
                : "When people share their contact info with you, they'll appear here"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredVisitors.length > itemsPerPage && (
        <div className="card-glass p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredVisitors.length)} of{" "}
              {filteredVisitors.length} contacts
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
