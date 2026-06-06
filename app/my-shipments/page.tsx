"use client";

import { useCallback, useEffect, useState } from "react";
import api from "../../lib/api";
import { normalizeRole } from "../../lib/auth";
import { useRouter } from "next/navigation";

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
}

export default function MyShipments() {
  const router = useRouter();
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  const fetchShipments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<ShipmentRecord[]>("/Shipment/my-shipments");
      setShipments(response.data || []);
    } catch (err: unknown) {
      setError("Gagal memuat data pengiriman");
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

    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchShipments();
  }, [fetchShipments, router]);

  const filteredShipments = filter === "All" 
    ? shipments 
    : shipments.filter(s => s.status === filter);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Picked":
        return "bg-blue-100 text-blue-800";
      case "On Delivery":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusCounts = {
    All: shipments.length,
    Pending: shipments.filter(s => s.status === "Pending").length,
    Picked: shipments.filter(s => s.status === "Picked").length,
    "On Delivery": shipments.filter(s => s.status === "On Delivery").length,
    Delivered: shipments.filter(s => s.status === "Delivered").length,
  };

  return (
    <div className="main-shell page-shell min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-3xl font-bold mb-1">📦 Paket Saya</h1>
        <p className="text-red-100">Kelola semua pengiriman Anda</p>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`p-4 rounded-lg font-bold transition ${
                filter === status
                  ? "bg-red-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              <div className="text-2xl">{count}</div>
              <div className="text-xs mt-1">{status}</div>
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">⏳</div>
            <p className="mt-2 text-gray-600">Memuat data pengiriman...</p>
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-600 mb-4">Belum ada pengiriman dengan status ini</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              ➕ Buat Pengiriman
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredShipments.map((shipment) => (
              <div
                key={shipment.id}
                onClick={() => router.push(`/track/${shipment.resi}`)}
                className="bg-white rounded-2xl p-4 md:p-6 shadow hover:shadow-lg transition cursor-pointer border-l-4 border-red-600"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-bold text-lg text-gray-900">
                      {shipment.resi}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(shipment.createdAt).toLocaleDateString("id-ID")}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeColor(shipment.status)}`}>
                    {shipment.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Dari</div>
                    <div className="font-semibold text-gray-900">{shipment.origin}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Ke</div>
                    <div className="font-semibold text-gray-900">{shipment.destination}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="text-gray-600">
                    📦 {shipment.weight} kg • {shipment.service}
                  </div>
                  <div className="text-red-600 font-bold">
                    Rp {shipment.shippingCost?.toLocaleString("id-ID") || 0}
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
