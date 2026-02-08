import React, { useState, useEffect } from "react";
import {
  Download,
  Search,
  Mail,
  Phone,
  MapPin,
  Monitor,
  Eye,
  MousePointerClick,
  Smartphone,
  MailCheck,
  Smartphone as NfcIcon,
  QrCode,
  Link2,
  Globe,
  Linkedin,
  Github,
  Instagram,
  Twitter,
  Link as LinkIcon,
  BarChart3,
  MapPinned,
} from "lucide-react";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [selectables, setSelectables] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [visitorStats, setVisitorStats] = useState(null);
  const [days, setDays] = useState(30);
  const [searchTerm, setSearchTerm] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchSelectables();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      fetchAnalytics(selectedItem, days);
      // Visitors and VisitorStats currently only supported for full profiles
      if (selectedItem.type === "profile") {
        fetchVisitors(selectedItem.id);
        fetchVisitorStats(selectedItem.id);
      } else {
        setVisitors([]);
        setVisitorStats(null);
      }
    }
  }, [selectedItem, days]);

  const fetchSelectables = async () => {
    try {
      const token = localStorage.getItem("token");
      const [profilesRes, productsRes] = await Promise.all([
        fetch(`${API_URL}/api/profiles`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/user-products`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      const profilesData = await profilesRes.json();
      const productsData = await productsRes.json();

      const items = [
        ...(profilesData.data || []).map(p => ({ ...p, type: 'profile' })),
        ...(productsData.data || []).map(p => ({ 
          ...p, 
          type: 'user-product',
          name: p.nickname || p.product?.name || "Unnamed Product",
          profileType: p.productType 
        }))
      ];

      setSelectables(items);
      if (items.length > 0) {
        setSelectedItem(items[0]);
      }
    } catch (error) {
      console.error("Error fetching selectables:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async (item, period) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = item.type === "profile"
        ? `${API_URL}/api/analytics/profile/${item.id}?days=${period}`
        : `${API_URL}/api/analytics/user-product/${item.id}?days=${period}`;

      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setAnalytics(data.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const fetchVisitors = async (profileId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/profiles/${profileId}/visitors`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (data.success) {
        setVisitors(data.data.visitors || []);
      }
    } catch (error) {
      console.error("Error fetching visitors:", error);
    }
  };

  const fetchVisitorStats = async (profileId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/profiles/${profileId}/visitors/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (data.success) {
        setVisitorStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching visitor stats:", error);
    }
  };

  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.visitorEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.visitorPhone?.includes(searchTerm) ||
      visitor.visitorCountry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = [
      "Email",
      "Phone",
      "Country",
      "City",
      "Device",
      "Browser",
      "Source",
      "Date",
    ];
    const csvData = filteredVisitors.map((visitor) => [
      visitor.visitorEmail,
      visitor.visitorPhone,
      visitor.visitorCountry || "Unknown",
      visitor.visitorCity || "Unknown",
      visitor.device || "Unknown",
      visitor.browser || "Unknown",
      visitor.viewSource,
      new Date(visitor.submittedAt).toLocaleString(),
    ]);

    const csv = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visitor-contacts-${new Date().toISOString()}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (selectables.length === 0) {
    return (
      <div className="card-glass p-12 text-center">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold text-brand-dark mb-2">
          No data yet
        </h3>
        <p className="text-gray-600">
          Create a profile or product to start tracking analytics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-primary to-blue-600 bg-clip-text text-transparent">
          Analytics
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Track your {selectedItem?.type === 'profile' ? 'profile' : 'product'} performance
        </p>
      </div>

      <div className="card-glass p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Profile or Product
            </label>
            <select
              value={selectedItem?.id || ""}
              onChange={(e) => {
                const item = selectables.find(s => s.id === Number(e.target.value));
                setSelectedItem(item);
              }}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
            >
              {selectables.map((item) => (
                <option key={`${item.type}-${item.id}`} value={item.id}>
                  {item.name} ({item.type === 'profile' ? (item.profileType || 'Profile') : (item.profileType?.replace('_', ' ') || 'Product')})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Period
            </label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {analytics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-glass p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {selectedItem.type === 'profile' ? 'Total Views' : 'Total Scans'}
                  </p>
                  <p className="text-2xl font-bold text-brand-dark">
                    {analytics.analytics?.totalViews || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="card-glass p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  {selectedItem.type === 'profile' ? <MousePointerClick className="w-6 h-6 text-green-600" /> : <Link2 className="w-6 h-6 text-green-600" />}
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {selectedItem.type === 'profile' ? 'Link Clicks' : 'Redirections'}
                  </p>
                  <p className="text-2xl font-bold text-brand-dark">
                    {selectedItem.type === 'profile' 
                      ? (analytics.socialLinks?.reduce((sum, link) => sum + link.clickCount, 0) || 0)
                      : (analytics.redirectCount || 0)
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="card-glass p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Devices</p>
                  <p className="text-2xl font-bold text-brand-dark">
                    {analytics.analytics?.viewsByDevice?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="card-glass p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  {selectedItem.type === 'profile' ? <MailCheck className="w-6 h-6 text-orange-600" /> : <BarChart3 className="w-6 h-6 text-orange-600" />}
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {selectedItem.type === 'profile' ? 'Visitor Contacts' : 'Success Rate'}
                  </p>
                  <p className="text-2xl font-bold text-brand-dark">
                    {selectedItem.type === 'profile' 
                      ? (visitorStats?.totalVisitors || 0)
                      : `${Math.round(((analytics.redirectCount || 0) / (analytics.analytics?.totalViews || 1)) * 100)}%`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-glass p-6">
              <h2 className="text-xl font-bold text-brand-dark mb-4">
                Views by Source
              </h2>
              {analytics.analytics?.viewsBySource?.length > 0 ? (
                <div className="space-y-3">
                  {analytics.analytics.viewsBySource.map((item) => (
                    <div
                      key={item.viewSource}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {item.viewSource === "nfc" ? (
                          <NfcIcon className="w-6 h-6 text-blue-600" />
                        ) : item.viewSource === "qr" ? (
                          <QrCode className="w-6 h-6 text-green-600" />
                        ) : item.viewSource === "link" ? (
                          <Link2 className="w-6 h-6 text-purple-600" />
                        ) : (
                          <Globe className="w-6 h-6 text-gray-600" />
                        )}
                        <span className="font-medium capitalize">
                          {item.viewSource}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-brand-dark">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No views yet</p>
              )}
            </div>

            <div className="card-glass p-6">
              <h2 className="text-xl font-bold text-brand-dark mb-4">
                Top Locations
              </h2>
              {analytics.analytics?.viewsByCountry?.length > 0 ? (
                <div className="space-y-3">
                  {analytics.analytics.viewsByCountry
                    .slice(0, 5)
                    .map((item) => (
                      <div
                        key={item.viewerCountry}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium">
                          {item.viewerCountry || "Unknown"}
                        </span>
                        <span className="text-lg font-bold text-brand-dark">
                          {item.count}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">
                  No location data yet
                </p>
              )}
            </div>
          </div>

          {selectedItem.type === 'profile' && (
            <>
              <div className="card-glass p-6">
                <h2 className="text-xl font-bold text-brand-dark mb-4">
                  Social Links Performance
                </h2>
                {analytics.socialLinks?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analytics.socialLinks.map((link) => (
                      <div
                        key={link.platform}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {link.platform === "linkedin" ? (
                            <Linkedin className="w-6 h-6 text-blue-600" />
                          ) : link.platform === "github" ? (
                            <Github className="w-6 h-6 text-gray-800" />
                          ) : link.platform === "instagram" ? (
                            <Instagram className="w-6 h-6 text-pink-600" />
                          ) : link.platform === "twitter" ? (
                            <Twitter className="w-6 h-6 text-blue-400" />
                          ) : (
                            <LinkIcon className="w-6 h-6 text-gray-600" />
                          )}
                          <div>
                            <p className="font-medium capitalize">
                              {link.platform}
                            </p>
                            <p className="text-sm text-gray-600">
                              {link.clickCount} clicks
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-brand-dark">
                            {link.clickCount}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">
                    No social links added yet
                  </p>
                )}
              </div>

              {/* VISITOR CONTACTS SECTION - REPLACES RECENT VIEWS */}
              <div className="card-glass p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-brand-dark">
                    Visitor Contacts
                  </h2>
                  {visitors.length > 0 && (
                    <button
                      onClick={exportToCSV}
                      className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export CSV
                    </button>
                  )}
                </div>

                {visitors.length > 0 ? (
                  <>
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search by email, phone, or country..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                              Contact Info
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
                          {filteredVisitors.map((visitor) => (
                            <tr
                              key={visitor.id}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-4 px-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <a
                                      href={`mailto:${visitor.visitorEmail}`}
                                      className="text-brand-primary hover:underline"
                                    >
                                      {visitor.visitorEmail}
                                    </a>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <a
                                      href={`tel:${visitor.visitorPhone}`}
                                      className="hover:text-brand-primary"
                                    >
                                      {visitor.visitorPhone}
                                    </a>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span>
                                    {visitor.visitorCity || "Unknown"},{" "}
                                    {visitor.visitorCountry || "Unknown"}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Monitor className="w-4 h-4 text-gray-400" />
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
                                  {visitor.viewSource === "nfc" ? (
                                    <>
                                      <NfcIcon className="w-3 h-3" /> NFC
                                    </>
                                  ) : visitor.viewSource === "qr" ? (
                                    <>
                                      <QrCode className="w-3 h-3" /> QR
                                    </>
                                  ) : visitor.viewSource === "link" ? (
                                    <>
                                      <Link2 className="w-3 h-3" /> Link
                                    </>
                                  ) : (
                                    <>
                                      <Globe className="w-3 h-3" /> Direct
                                    </>
                                  )}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-sm text-gray-600">
                                {new Date(visitor.submittedAt).toLocaleDateString()}
                                <br />
                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    visitor.submittedAt
                                  ).toLocaleTimeString()}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {filteredVisitors.length === 0 && (
                      <p className="text-gray-600 text-center py-8">
                        No visitors match your search
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <MailCheck className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No visitor contacts yet
                    </h3>
                    <p className="text-gray-600">
                      When people tap your NFC card and share their contact info,
                      they'll appear here
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
