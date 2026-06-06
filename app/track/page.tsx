"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../../lib/api";
import { AppLayout } from "../../components/ui/AppLayout";
import { Timeline } from "../../components/ui/Timeline";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { motion } from "framer-motion";
import {
  Package,
  MapPin,
  Calendar,
  Weight,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Search,
  Zap,
  Clock,
} from "lucide-react";

interface ShipmentDetail {
  resi: string;
  status: string;
  senderName?: string;
  receiverName?: string;
  origin?: string;
  destination?: string;
  weight?: number;
  cost?: number;
  service?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  createdAt?: string;
  history?: Array<{
    status: string;
    timestamp: string;
    description: string;
  }>;
}

// Skeleton Components
function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="space-y-4">
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="h-8 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}

function SkeletonShipmentOverview() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid lg:grid-cols-3 gap-6"
    >
      <div className="lg:col-span-2">
        <div className="card card--gradient-secondary p-8 animate-pulse">
          <div className="h-32 bg-white/20 rounded"></div>
        </div>
      </div>
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </motion.div>
  );
}

function TrackingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resiParam = searchParams.get("resi");

  const [resi, setResi] = useState(resiParam || "");
  const [loading, setLoading] = useState(!!resiParam);
  const [error, setError] = useState("");
  const [shipment, setShipment] = useState<ShipmentDetail | null>(null);
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    if (resiParam) {
      handleTrack(resiParam);
    }
  }, [resiParam]);

  const handleTrack = async (resiNumber: string) => {
    const trimmed = resiNumber.trim();

    if (!trimmed) {
      setInputError("Nomor resi tidak boleh kosong");
      return;
    }

    if (trimmed.length < 3) {
      setInputError("Nomor resi minimal 3 karakter");
      return;
    }

    setLoading(true);
    setError("");
    setInputError("");
    setShipment(null);

    try {
      const res = await api.get<{ shipment: ShipmentDetail } | ShipmentDetail>(
        `/Shipment/track/${trimmed}`
      );
      const data = "shipment" in res.data ? res.data.shipment : res.data;
      setShipment(data);
      router.push(`/track?resi=${trimmed}`);
    } catch (err: unknown) {
      setError("Nomor resi tidak ditemukan. Silakan periksa kembali nomor Anda.");
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack(resi);
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle2 className="w-8 h-8 text-green-600" />;
      case "in transit":
      case "on delivery":
        return <Truck className="w-8 h-8 text-amber-600" />;
      case "pending":
        return <Clock className="w-8 h-8 text-blue-600" />;
      case "failed":
      case "cancelled":
        return <AlertCircle className="w-8 h-8 text-red-600" />;
      default:
        return <Package className="w-8 h-8 text-slate-600" />;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

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
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Kembali</span>
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                Lacak Pengiriman
              </h1>
              <p className="text-slate-600 text-sm">
                Pantau status paket Anda secara real-time
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="card"
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Masukkan nomor resi (contoh: JNE20260607001)"
                  className={`form-input w-full px-4 py-3 rounded-lg border-2 transition ${
                    inputError
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-slate-200 focus:border-red-500 focus:ring-red-100"
                  }`}
                  value={resi}
                  onChange={(e) => {
                    setResi(e.target.value.toUpperCase());
                    setInputError("");
                  }}
                  disabled={loading}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="btn btn--primary btn--lg flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-75"
              >
                <Search size={18} />
                {loading ? "Mencari..." : "Cari"}
              </motion.button>
            </div>

            {/* Validation Errors */}
            {inputError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"
              >
                <AlertCircle size={16} className="flex-shrink-0" />
                <span className="text-sm">{inputError}</span>
              </motion.div>
            )}

            {/* API Errors */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"
              >
                <AlertCircle size={16} className="flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}
          </div>
        </motion.form>

        {/* Loading State with Skeleton */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SkeletonShipmentOverview />
            <div className="mt-6 space-y-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </motion.div>
        )}

        {/* Success State */}
        {shipment && !loading && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6"
          >
            {/* Status Overview */}
            <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
              {/* Main Status Card */}
              <div className="lg:col-span-2">
                <div className="card card--gradient-secondary text-white p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-sm opacity-75 uppercase tracking-wider mb-2 font-semibold">
                        Status Pengiriman
                      </p>
                      <h2 className="text-4xl font-bold">{shipment.status}</h2>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                    >
                      {getStatusIcon(shipment.status)}
                    </motion.div>
                  </div>

                  <div className="space-y-4 text-sm opacity-95 border-t border-white/20 pt-6">
                    {shipment.createdAt && (
                      <div className="flex items-center justify-between">
                        <span className="opacity-75">Dikirim sejak:</span>
                        <span className="font-semibold">
                          {new Date(shipment.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    )}
                    {shipment.estimatedDelivery && (
                      <div className="flex items-center justify-between">
                        <span className="opacity-75">Estimasi sampai:</span>
                        <span className="font-semibold">
                          {new Date(shipment.estimatedDelivery).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    )}
                    {shipment.actualDelivery && (
                      <div className="flex items-center justify-between">
                        <span className="opacity-75">Terkirim pada:</span>
                        <span className="font-semibold text-green-300">
                          {new Date(shipment.actualDelivery).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Info Cards */}
              <motion.div variants={itemVariants} className="space-y-4">
                {/* Resi Card */}
                <div className="card hover:shadow-lg transition-shadow">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Nomor Resi
                  </p>
                  <p className="text-lg font-mono font-bold text-slate-900 break-all">
                    {shipment.resi}
                  </p>
                </div>

                {/* Service Card */}
                {shipment.service && (
                  <div className="card hover:shadow-lg transition-shadow">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Layanan
                    </p>
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-600" />
                      <p className="text-lg font-bold text-slate-900">
                        {shipment.service}
                      </p>
                    </div>
                  </div>
                )}

                {/* Cost Card */}
                {shipment.cost && (
                  <div className="card hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-emerald-50">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Biaya Pengiriman
                    </p>
                    <p className="text-xl font-bold text-green-700">
                      Rp {shipment.cost.toLocaleString("id-ID")}
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Shipment Route */}
            <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-6">
              {/* Pengirim */}
              <div className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-lg">
                    Pengirim
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-900 font-semibold">
                    {shipment.senderName || "-"}
                  </p>
                  <p className="text-sm text-slate-600 flex items-start gap-2">
                    <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{shipment.origin || "-"}</span>
                  </p>
                </div>
              </div>

              {/* Penerima */}
              <div className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package size={24} className="text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-lg">
                    Penerima
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-900 font-semibold">
                    {shipment.receiverName || "-"}
                  </p>
                  <p className="text-sm text-slate-600 flex items-start gap-2">
                    <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{shipment.destination || "-"}</span>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Package Details */}
            {shipment.weight && (
              <motion.div
                variants={itemVariants}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Weight size={24} className="text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-lg">
                    Detail Paket
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                      Berat
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {shipment.weight} <span className="text-sm text-slate-600">kg</span>
                    </p>
                  </div>
                  {shipment.service && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                        Tipe Layanan
                      </p>
                      <p className="text-lg font-bold text-slate-900">
                        {shipment.service}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Timeline History */}
            {shipment.history && shipment.history.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock size={24} className="text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-lg">
                    Riwayat Pengiriman
                  </h3>
                </div>
                <Timeline items={shipment.history} showDates={true} />
              </motion.div>
            )}

            {/* Dates Comparison */}
            {(shipment.estimatedDelivery || shipment.actualDelivery) && (
              <motion.div
                variants={itemVariants}
                className="card bg-gradient-to-br from-slate-50 to-slate-100"
              >
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar size={20} />
                  Perbandingan Tanggal
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {shipment.estimatedDelivery && (
                    <div className="p-4 bg-white rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-600 uppercase font-semibold mb-2">
                        Estimasi Pengiriman
                      </p>
                      <p className="text-lg font-bold text-slate-900">
                        {formatDate(shipment.estimatedDelivery)}
                      </p>
                    </div>
                  )}
                  {shipment.actualDelivery && (
                    <div className="p-4 bg-white rounded-lg border border-green-200">
                      <p className="text-xs text-green-600 uppercase font-semibold mb-2">
                        Tanggal Terkirim
                      </p>
                      <p className="text-lg font-bold text-green-700">
                        {formatDate(shipment.actualDelivery)}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !shipment && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Package size={40} className="text-slate-400" />
            </motion.div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-3">
              Mulai Lacak Paket Anda
            </h3>
            <p className="text-slate-600 max-w-sm mx-auto mb-6">
              Masukkan nomor resi di atas untuk melacak status pengiriman paket
              Anda secara real-time
            </p>
            <p className="text-sm text-slate-500">
              💡 Nomor resi biasanya dimulai dengan kode kurir (JNE, TIKI, dll)
            </p>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TrackingContent />
    </Suspense>
  );
}
