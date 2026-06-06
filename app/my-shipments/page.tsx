"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search, Download, CheckSquare2, Square, Filter, X, Eye, Truck, Package, Calendar } from "lucide-react";
import api from "../../lib/api";
import { normalizeRole } from "../../lib/auth";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { LoadingSkeleton, LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

interface ShipmentRecord {
  id: number;
  resi: string;
  status: string;
  origin: string;
  destination: string;
  createdAt: string;
  weight: number;
  service?: string;
  shippingCost?: number;
  senderName?: string;
  receiverName?: string;
}

type SortOption = "newest" | "oldest" | "status";
type ViewMode = "grid" | "table";

const STATUSES = ["Pending", "In Transit", "Delivered", "Failed", "Cancelled"] as const;

const statusColors: Record<string, { badge: string; text: string; icon: string }> = {
  Pending: { badge: "bg-blue-100 text-blue-700", text: "text-blue-600", icon: "📋" },
  "In Transit": { badge: "bg-amber-100 text-amber-700", text: "text-amber-600", icon: "🚚" },
  Delivered: { badge: "bg-green-100 text-green-700", text: "text-green-600", icon: "✓" },
  Failed: { badge: "bg-red-100 text-red-700", text: "text-red-600", icon: "✗" },
  Cancelled: { badge: "bg-slate-100 text-slate-700", text: "text-slate-600", icon: "⊘" },
};

export default function MyShipments() {
  const router = useRouter();
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<typeof STATUSES[number] | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedShipments, setSelectedShipments] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const itemsPerPage = 12;

  const fetchShipments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get<ShipmentRecord[]>("/Shipment/my-shipments");
      setShipments(response.data || []);
      setRetrying(false);
    } catch (err: unknown) {
      setError("Gagal memuat data pengiriman. Silakan coba lagi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = normalizeRole(localStorage.getItem("role"));

    if (!token || role !== "User") {
      router.push("/");
      return;
    }

    void fetchShipments();
  }, [fetchShipments, router]);

  const handleRetry = async () => {
    setRetrying(true);
    await fetchShipments();
  };

  const filteredAndSortedShipments = useMemo(() => {
    let filtered = shipments;

    if (selectedStatus !== "All") {
      filtered = filtered.filter(s => s.status === selectedStatus);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.resi.toLowerCase().includes(query) ||
        s.receiverName?.toLowerCase().includes(query) ||
        s.origin?.toLowerCase().includes(query) ||
        s.destination?.toLowerCase().includes(query)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "status") {
        const statusOrder = ["Pending", "In Transit", "Failed", "Delivered", "Cancelled"];
        return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      }
      return 0;
    });

    return sorted;
  }, [shipments, selectedStatus, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedShipments.length / itemsPerPage);
  const paginatedShipments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedShipments.slice(start, start + itemsPerPage);
  }, [filteredAndSortedShipments, currentPage]);

  const stats = useMemo(() => ({
    total: shipments.length,
    pending: shipments.filter(s => s.status === "Pending").length,
    inTransit: shipments.filter(s => s.status === "In Transit").length,
    delivered: shipments.filter(s => s.status === "Delivered").length,
    failed: shipments.filter(s => s.status === "Failed").length,
  }), [shipments]);

  const handleSelectShipment = (id: number) => {
    setSelectedShipments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedShipments.size === paginatedShipments.length) {
      setSelectedShipments(new Set());
    } else {
      setSelectedShipments(new Set(paginatedShipments.map(s => s.id)));
    }
  };

  const exportToCSV = () => {
    const dataToExport = selectedShipments.size > 0
      ? paginatedShipments.filter(s => selectedShipments.has(s.id))
      : filteredAndSortedShipments;

    const headers = ["Resi", "Status", "Dari", "Ke", "Berat (kg)", "Tanggal", "Biaya"];
    const csv = [
      headers.join(","),
      ...dataToExport.map(s =>
        [
          s.resi,
          s.status,
          s.origin,
          s.destination,
          s.weight,
          new Date(s.createdAt).toLocaleDateString("id-ID"),
          s.shippingCost || "0"
        ].map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `pengiriman-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const markAsDelivered = () => {
    if (selectedShipments.size === 0) return;
    alert(`Menandai ${selectedShipments.size} pengiriman sebagai terkirim`);
    setSelectedShipments(new Set());
  };

  const openDetails = async (resi: string) => {
    router.push(`/track/${resi}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">📦 Pengiriman Saya</h1>
              <p className="text-slate-600 mt-1">Kelola dan lacak semua pengiriman Anda</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                {viewMode === "grid" ? "📊 Tabel" : "⬜ Grid"}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "Total", value: stats.total, icon: "📦" },
              { label: "Pending", value: stats.pending, icon: "📋" },
              { label: "Dalam Perjalanan", value: stats.inTransit, icon: "🚚" },
              { label: "Terkirim", value: stats.delivered, icon: "✓" },
              { label: "Gagal", value: stats.failed, icon: "✗" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-sm font-medium text-slate-600">{stat.label}</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between">
            <div>
              <p className="text-red-800 font-medium">Terjadi kesalahan</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="text-red-600 hover:text-red-700 font-medium text-sm px-4 py-2 bg-red-100 rounded-lg transition disabled:opacity-50"
            >
              {retrying ? "Mencoba..." : "Coba Lagi"}
            </button>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <Input
                placeholder="Cari nomor resi atau nama penerima..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition flex items-center gap-2 font-medium"
            >
              <Filter size={18} />
              Filter {selectedStatus !== "All" && "✓"}
            </button>
          </div>

          {showFilters && (
            <div className="mb-4 pb-4 border-t border-slate-200 pt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {["All", ...STATUSES].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setSelectedStatus(status as typeof selectedStatus);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      selectedStatus === status
                        ? "bg-red-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sort and Actions */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex gap-2 w-full md:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 hover:border-slate-300 transition"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="status">Status</option>
              </select>
            </div>

            {selectedShipments.size > 0 && (
              <div className="flex gap-2 w-full md:w-auto">
                <span className="px-3 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg">
                  {selectedShipments.size} dipilih
                </span>
                <button
                  onClick={markAsDelivered}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                >
                  ✓ Tandai Terkirim
                </button>
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <Download size={16} />
                  Export CSV
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {loading && !retrying ? (
          <LoadingSkeleton />
        ) : filteredAndSortedShipments.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Belum ada pengiriman"
            description={searchQuery || selectedStatus !== "All"
              ? "Tidak ada pengiriman yang cocok dengan filter Anda"
              : "Mulai buat pengiriman pertama Anda sekarang"}
            action={{
              label: "Buat Pengiriman",
              onClick: () => router.push("/dashboard"),
            }}
          />
        ) : viewMode === "grid" ? (
          <>
            {/* Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {paginatedShipments.map((shipment) => (
                <div key={shipment.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nomor Resi</div>
                        <h3 className="text-lg font-bold text-slate-900 font-mono">{shipment.resi}</h3>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedShipments.has(shipment.id)}
                        onChange={() => handleSelectShipment(shipment.id)}
                        className="w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                    </div>

                    {/* Status */}
                    <div className="mb-4">
                      <StatusBadge status={shipment.status} />
                    </div>

                    {/* Route */}
                    <div className="space-y-3 mb-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-lg">{statusColors[shipment.status]?.icon || "📦"}</span>
                        <div>
                          <p className="text-slate-900 font-medium">{shipment.senderName || "Pengirim"}</p>
                          <p className="text-xs text-slate-500">Dari</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center py-1">
                        <div className="h-0.5 flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
                        <Truck size={16} className="text-slate-400 mx-2" />
                        <div className="h-0.5 flex-1 bg-gradient-to-l from-slate-200 to-transparent"></div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-lg">📍</span>
                        <div>
                          <p className="text-slate-900 font-medium">{shipment.receiverName || "Penerima"}</p>
                          <p className="text-xs text-slate-500">Ke</p>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div>
                        <p className="text-slate-500 text-xs mb-1 font-medium">Rute</p>
                        <p className="text-slate-900 font-semibold">{shipment.origin?.split(",")[0] || "-"}</p>
                        <p className="text-slate-600 text-xs">→ {shipment.destination?.split(",")[0] || "-"}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1 font-medium">Tanggal</p>
                        <p className="text-slate-900 font-semibold flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(shipment.createdAt).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>

                    {shipment.weight && (
                      <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1 font-medium">Berat & Biaya</p>
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-slate-900">{shipment.weight} kg</p>
                          <p className="font-bold text-red-600">Rp {(shipment.shippingCost || 0).toLocaleString("id-ID")}</p>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <button
                      onClick={() => openDetails(shipment.resi)}
                      className="w-full py-2 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:translate-y-0"
                    >
                      <Eye size={16} />
                      Lihat Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Table View */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedShipments.size === paginatedShipments.length && paginatedShipments.length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Resi</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Rute</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Berat</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Biaya</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedShipments.map((shipment, idx) => (
                      <tr key={shipment.id} className={`border-b border-slate-200 hover:bg-slate-50 transition ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedShipments.has(shipment.id)}
                            onChange={() => handleSelectShipment(shipment.id)}
                            className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-slate-900">{shipment.resi}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          <div className="font-medium">{shipment.origin?.split(",")[0]}</div>
                          <div className="text-slate-500 text-xs">→ {shipment.destination?.split(",")[0]}</div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={shipment.status} />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(shipment.createdAt).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {shipment.weight} kg
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-red-600">
                          Rp {(shipment.shippingCost || 0).toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openDetails(shipment.resi)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                          >
                            <Eye size={14} />
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Menampilkan <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredAndSortedShipments.length)}</span> dari <span className="font-semibold">{filteredAndSortedShipments.length}</span> pengiriman
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ← Sebelumnya
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition ${
                      currentPage === page
                        ? "bg-red-600 text-white"
                        : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Selanjutnya →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
