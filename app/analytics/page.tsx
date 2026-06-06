"use client";

import { useCallback, useEffect, useState } from "react";
import api from "../../lib/api";
import { normalizeRole } from "../../lib/auth";
import { useRouter } from "next/navigation";

type AnalyticsResponse = {
  totalShipments: number;
  deliveredCount: number;
  deliveredPercentage: number;
  pendingCount: number;
  pendingPercentage: number;
  onDeliveryCount: number;
  topDestinations: Array<{ destination: string; count: number }>;
  shipmentsPerDay: Array<{ date: string; count: number }>;
};

export default function Analytics() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/Shipment/analytics");
      setAnalytics(response.data);
    } catch (err: unknown) {
      setError("Gagal memuat analytics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const role = normalizeRole(localStorage.getItem("role"));

      if (!token || role !== "Admin") {
        router.push("/");
        return;
      }

      void fetchAnalytics();
    };

    checkAuth();
  }, [fetchAnalytics, router]);

  if (loading) {
    return (
      <div className="main-shell page-shell min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-gray-600">Memuat analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="main-shell page-shell min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="main-shell page-shell min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-3xl font-bold mb-1">📊 Dashboard Analytics</h1>
        <p className="text-red-100">Pantau kinerja operasional JNE Express</p>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="text-4xl mb-2">📦</div>
            <p className="text-gray-500 text-sm mb-1">Total Pengiriman</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.totalShipments}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-gray-500 text-sm mb-1">Delivered</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-green-600">{analytics.deliveredCount}</p>
              <p className="text-sm text-gray-500">({analytics.deliveredPercentage}%)</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-600">
            <div className="text-4xl mb-2">⏳</div>
            <p className="text-gray-500 text-sm mb-1">Pending</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-yellow-600">{analytics.pendingCount}</p>
              <p className="text-sm text-gray-500">({analytics.pendingPercentage}%)</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-600">
            <div className="text-4xl mb-2">🚚</div>
            <p className="text-gray-500 text-sm mb-1">On Delivery</p>
            <p className="text-3xl font-bold text-purple-600">{analytics.onDeliveryCount}</p>
          </div>
        </div>

        {/* Top Destinations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900">🌍 Top Destinasi</h2>
            <div className="space-y-4">
              {analytics.topDestinations?.map((dest, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="text-2xl">
                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "📌"}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{dest.destination}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{
                          width: `${(dest.count / analytics.totalShipments) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="font-bold text-gray-900 w-12 text-right">
                    {dest.count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipments Per Day Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900">📈 Pengiriman Per Hari</h2>
            <div className="space-y-3">
              {analytics.shipmentsPerDay?.map((data, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-20 text-sm font-semibold text-gray-700">
                    {new Date(data.date).toLocaleDateString("id-ID", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 flex items-center">
                    <div
                      className="bg-gradient-to-r from-red-600 to-red-700 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{
                        width: `${(data.count / Math.max(...analytics.shipmentsPerDay.map((d) => d.count), 1)) * 100}%`,
                      }}
                    >
                      {data.count > 0 && (
                        <span className="text-xs font-bold text-white">{data.count}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold mb-6 text-gray-900">📊 Distribusi Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{analytics.totalShipments}</p>
              <p className="text-sm text-gray-600 mt-1">Semua Pengiriman</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {analytics.deliveredPercentage.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600 mt-1">Terkirim</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-3xl font-bold text-yellow-600">
                {analytics.pendingPercentage.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600 mt-1">Pending</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">
                {(
                  100 -
                  analytics.deliveredPercentage -
                  analytics.pendingPercentage
                ).toFixed(1)}
%
              </p>
              <p className="text-sm text-gray-600 mt-1">In Progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
