"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../../lib/api";
import { AppLayout } from "../../components/ui/AppLayout";
import { Timeline } from "../../components/ui/Timeline";
import { ShipmentCard } from "../../components/ui/ShipmentCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { motion } from "framer-motion";
import { Package, MapPin, Calendar, Weight, Truck, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

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

function TrackingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resiParam = searchParams.get("resi");

  const [resi, setResi] = useState(resiParam || "");
  const [loading, setLoading] = useState(!!resiParam);
  const [error, setError] = useState("");
  const [shipment, setShipment] = useState<ShipmentDetail | null>(null);

  useEffect(() => {
    if (resiParam) {
      handleTrack(resiParam);
    }
  }, [resiParam]);

  const handleTrack = async (resiNumber: string) => {
    if (!resiNumber.trim()) {
      setError("Masukkan nomor resi");
      return;
    }

    setLoading(true);
    setError("");
    setShipment(null);

    try {
      const res = await api.get<{ shipment: ShipmentDetail } | ShipmentDetail>(
        `/Shipment/track/${resiNumber}`
      );
      const data = "shipment" in res.data ? res.data.shipment : res.data;
      setShipment(data);
      // Update URL
      router.push(`/track?resi=${resiNumber}`);
    } catch (err) {
      setError("Nomor resi tidak ditemukan");
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack(resi);
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
            <span>Kembali</span>
          </button>

          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
            Lacak Pengiriman
          </h1>
          <p className="text-slate-600 mt-2">
            Masukkan nomor resi untuk melihat status paket Anda secara real-time
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="card"
        >
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Masukkan nomor resi JNE (contoh: JNE20260607001)"
              className="form-input flex-1"
              value={resi}
              onChange={(e) => setResi(e.target.value)}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="btn btn--primary btn--lg"
            >
              {loading ? "Mencari..." : "Cari"}
            </motion.button>
          </div>
          {error && (
            <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </motion.form>

        {/* Results */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <LoadingSpinner />
          </motion.div>
        )}

        {shipment && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Status Overview */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="card card--gradient-secondary text-white p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm opacity-75 uppercase tracking-wider mb-2">
                        Status Pengiriman
                      </p>
                      <h2 className="text-3xl font-bold">{shipment.status}</h2>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={32} />
                    </div>
                  </div>

                  <div className="space-y-3 text-sm opacity-90">
                    {shipment.estimatedDelivery && (
                      <p>
                        Estimasi pengiriman:{" "}
                        <span className="font-semibold">
                          {new Date(shipment.estimatedDelivery).toLocaleDateString(
                            "id-ID",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </p>
                    )}
                    {shipment.actualDelivery && (
                      <p>
                        Tanggal terkirim:{" "}
                        <span className="font-semibold">
                          {new Date(shipment.actualDelivery).toLocaleDateString(
                            "id-ID",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Quick Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-4"
              >
                <div className="card">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Nomor Resi
                  </p>
                  <p className="text-xl font-bold text-slate-900 font-mono">
                    {shipment.resi}
                  </p>
                </div>

                {shipment.service && (
                  <div className="card">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Layanan
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {shipment.service}
                    </p>
                  </div>
                )}

                {shipment.cost && (
                  <div className="card">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Biaya
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      Rp {shipment.cost.toLocaleString("id-ID")}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Details Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              {/* Pengirim */}
              <div className="card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin size={20} className="text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">Pengirim</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-900 font-medium">{shipment.senderName}</p>
                  <p className="text-sm text-slate-600">{shipment.origin}</p>
                </div>
              </div>

              {/* Penerima */}
              <div className="card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Package size={20} className="text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">Penerima</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-900 font-medium">{shipment.receiverName}</p>
                  <p className="text-sm text-slate-600">{shipment.destination}</p>
                </div>
              </div>
            </motion.div>

            {/* Timeline */}
            {shipment.history && shipment.history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="card"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-6">
                  Riwayat Pengiriman
                </h3>
                <Timeline items={shipment.history} showDates={true} />
              </motion.div>
            )}

            {/* Additional Info */}
            {shipment.weight && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="card"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Weight size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Berat Paket</p>
                    <p className="text-xl font-bold text-slate-900">
                      {shipment.weight} kg
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {!loading && !shipment && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card p-12 text-center"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Belum ada pencarian
            </h3>
            <p className="text-slate-600">
              Masukkan nomor resi di atas untuk melacak paket Anda
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
