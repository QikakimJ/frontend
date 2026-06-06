"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../lib/api";
import { normalizeRole } from "../../lib/auth";
import { useRouter } from "next/navigation";
import { AppLayout } from "../../components/ui/AppLayout";
import { StatCard } from "../../components/ui/StatCard";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { TrendingUp, BarChart3, Package, Truck, MapPin } from "lucide-react";

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
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      </AppLayout>
    );
  }

  if (error || !analytics) {
    return (
      <AppLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="card bg-red-50 border border-red-200 text-red-700 p-6 text-center rounded-lg">
            <p className="text-lg font-semibold">{error || "Data not available"}</p>
          </div>
        </motion.div>
      </AppLayout>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <AppLayout>
      <motion.div
        className="page-wrapper space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Page Header */}
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 lg:p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">📊 Analytics Dashboard</h1>
            <p className="text-red-100">Pantau kinerja operasional JNE Express secara real-time</p>
          </div>
        </motion.div>

        {/* KPI Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-1 md:grid-2 lg:grid-4 gap-4">
          <StatCard
            icon={Package}
            title="Total Pengiriman"
            value={analytics.totalShipments}
            variant="primary"
          />
          <StatCard
            icon={TrendingUp}
            title="Terkirim"
            value={analytics.deliveredCount}
            change={`${analytics.deliveredPercentage}%`}
            variant="success"
          />
          <StatCard
            icon={BarChart3}
            title="Pending"
            value={analytics.pendingCount}
            change={`${analytics.pendingPercentage}%`}
            variant="warning"
          />
          <StatCard
            icon={Truck}
            title="Dalam Pengiriman"
            value={analytics.onDeliveryCount}
            variant="error"
          />
        </motion.div>

        {/* Charts Section */}
        <motion.div variants={itemVariants} className="grid grid-1 lg:grid-2 gap-6">
          {/* Top Destinations */}
          <div className="card bg-white rounded-lg p-6 shadow-md border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <MapPin size={24} className="text-red-600" />
              <h2 className="text-xl font-bold text-slate-900">Top Destinasi</h2>
            </div>
            <div className="space-y-4">
              {analytics.topDestinations?.map((dest, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="text-xl font-bold w-8">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-semibold text-slate-900">{dest.destination}</p>
                      <span className="text-sm text-slate-500 font-medium">{dest.count}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(dest.count / Math.max(...analytics.topDestinations.map(d => d.count), 1)) * 100}%`,
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Shipments Per Day */}
          <div className="card bg-white rounded-lg p-6 shadow-md border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 size={24} className="text-red-600" />
              <h2 className="text-xl font-bold text-slate-900">Pengiriman Per Hari</h2>
            </div>
            <div className="space-y-3">
              {analytics.shipmentsPerDay?.map((data, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-16 text-sm font-semibold text-slate-700">
                    {new Date(data.date).toLocaleDateString("id-ID", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex-1 bg-slate-100 rounded-full h-8 flex items-center relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(data.count / Math.max(...analytics.shipmentsPerDay.map(d => d.count), 1)) * 100}%`,
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="bg-gradient-to-r from-red-600 to-red-700 h-8 rounded-full flex items-center justify-end pr-3"
                    >
                      {data.count > 0 && (
                        <span className="text-xs font-bold text-white">{data.count}</span>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Status Distribution */}
        <motion.div variants={itemVariants} className="card bg-white rounded-lg p-6 shadow-md border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">📊 Distribusi Status</h2>
          <div className="grid grid-1 md:grid-2 lg:grid-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200"
            >
              <p className="text-3xl font-bold text-blue-600">{analytics.totalShipments}</p>
              <p className="text-sm text-blue-700 mt-2 font-medium">Semua Pengiriman</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200"
            >
              <p className="text-3xl font-bold text-green-600">
                {analytics.deliveredPercentage.toFixed(1)}%
              </p>
              <p className="text-sm text-green-700 mt-2 font-medium">Terkirim ({analytics.deliveredCount})</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200"
            >
              <p className="text-3xl font-bold text-yellow-600">
                {analytics.pendingPercentage.toFixed(1)}%
              </p>
              <p className="text-sm text-yellow-700 mt-2 font-medium">Pending ({analytics.pendingCount})</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200"
            >
              <p className="text-3xl font-bold text-purple-600">
                {(
                  100 -
                  analytics.deliveredPercentage -
                  analytics.pendingPercentage
                ).toFixed(1)}
%
              </p>
              <p className="text-sm text-purple-700 mt-2 font-medium">Dalam Proses ({analytics.onDeliveryCount})</p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
