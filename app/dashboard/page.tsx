"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { normalizeRole } from "../../lib/auth";
import { AppLayout } from "../../components/ui/AppLayout";
import { StatCard } from "../../components/ui/StatCard";
import { ShipmentCard } from "../../components/ui/ShipmentCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { LoadingSpinner, LoadingSkeleton } from "../../components/ui/LoadingSpinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { motion } from "framer-motion";
import { Package, TrendingUp, CheckCircle, Clock, Plus, Search, Filter, Download, MoreVertical, Truck, BarChart3, MapPin, AlertCircle } from "lucide-react";

interface ShipmentRecord {
  id?: string;
  resi: string;
  status: string;
  senderName?: string;
  receiverName?: string;
  origin?: string;
  destination?: string;
  weight?: number;
  cost?: number;
  createdAt?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
}

interface DashboardStats {
  totalShipments: number;
  inTransit: number;
  delivered: number;
  pending: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string>("User");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalShipments: 0,
    inTransit: 0,
    delivered: 0,
    pending: 0,
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form states
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = normalizeRole(localStorage.getItem("role"));
    const storedEmail = localStorage.getItem("email");

    if (!token) {
      router.push("/");
      return;
    }

    setRole(storedRole);
    setEmail(storedEmail || "");
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get<ShipmentRecord[]>("/Shipment");
      const shipmentData = res.data || [];
      setShipments(shipmentData);

      // Calculate stats
      const total = shipmentData.length;
      const inTransit = shipmentData.filter(s => s.status === "In Transit").length;
      const delivered = shipmentData.filter(s => s.status === "Delivered").length;
      const pending = shipmentData.filter(s => s.status === "Pending").length;

      setStats({
        totalShipments: total,
        inTransit,
        delivered,
        pending,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senderName || !receiverName || !origin || !destination) {
      setMessage("Semua field harus diisi");
      return;
    }

    setFormLoading(true);
    try {
      const res = await api.post("/Shipment", {
        senderName,
        receiverName,
        origin,
        destination,
        weight: weight ? parseFloat(weight) : 1,
      });

      setMessage(`Resi berhasil dibuat: ${res.data.resi}`);
      setSenderName("");
      setReceiverName("");
      setOrigin("");
      setDestination("");
      setWeight("");
      setTimeout(() => {
        setShowCreateForm(false);
        setMessage("");
        fetchData();
      }, 1500);
    } catch (error) {
      setMessage("Gagal membuat resi");
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const filteredShipments = shipments.filter(
    (s) =>
      s.resi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.receiverName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-start justify-between"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
              Dashboard Pengiriman
            </h1>
            <p className="text-slate-600 mt-2">
              Kelola dan pantau semua pengiriman Anda dengan mudah
            </p>
          </div>

          {role === "User" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="btn btn--primary btn--lg"
            >
              <Plus size={20} />
              <span>Buat Pengiriman</span>
            </motion.button>
          )}
        </motion.div>

        {/* Statistics Grid */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid-4"
          >
            <StatCard
              title="Total Pengiriman"
              value={stats.totalShipments}
              icon={Package}
              variant="primary"
            />
            <StatCard
              title="Dalam Perjalanan"
              value={stats.inTransit}
              icon={Truck}
              variant="warning"
            />
            <StatCard
              title="Terkirim"
              value={stats.delivered}
              icon={CheckCircle}
              variant="success"
            />
            <StatCard
              title="Menunggu"
              value={stats.pending}
              icon={Clock}
              variant="error"
            />
          </motion.div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card card--gradient-primary"
          >
            <h3 className="text-xl font-bold mb-6">Buat Pengiriman Baru</h3>
            
            <form onSubmit={handleCreateShipment} className="space-y-4">
              <div className="grid-2">
                <div>
                  <label className="form-label">Nama Pengirim</label>
                  <input
                    type="text"
                    placeholder="Masukkan nama pengirim"
                    className="form-input"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Nama Penerima</label>
                  <input
                    type="text"
                    placeholder="Masukkan nama penerima"
                    className="form-input"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Asal Pengiriman</label>
                  <input
                    type="text"
                    placeholder="Misal: Jakarta"
                    className="form-input"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Tujuan Pengiriman</label>
                  <input
                    type="text"
                    placeholder="Misal: Surabaya"
                    className="form-input"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Berat (kg)</label>
                <input
                  type="number"
                  placeholder="Masukkan berat paket"
                  className="form-input"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="0.1"
                  step="0.1"
                />
              </div>

              {message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${message.includes("berhasil") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  <AlertCircle size={16} />
                  {message}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn btn--primary flex-1"
                >
                  {formLoading ? "Membuat..." : "Buat Pengiriman"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn btn--secondary flex-1"
                >
                  Batal
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Shipments Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Daftar Pengiriman</h2>
              <p className="text-slate-600 text-sm mt-1">{shipments.length} pengiriman total</p>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2.5 hover:bg-slate-100 rounded-lg transition">
                <Download size={20} className="text-slate-600" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Cari berdasarkan nomor resi, nama pengirim, atau penerima..."
              className="form-input pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Shipments Grid */}
          {loading ? (
            <LoadingSkeleton />
          ) : filteredShipments.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Belum ada pengiriman"
              description={
                searchTerm
                  ? "Tidak ditemukan pengiriman yang sesuai dengan pencarian Anda"
                  : "Mulai dengan membuat pengiriman baru untuk melihat data di sini"
              }
              action={
                !searchTerm && role === "User"
                  ? {
                      label: "Buat Pengiriman",
                      onClick: () => setShowCreateForm(true),
                    }
                  : undefined
              }
            />
          ) : (
            <div className="grid-3">
              {filteredShipments.map((shipment, index) => (
                <motion.div
                  key={shipment.resi}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ShipmentCard
                    resi={shipment.resi}
                    senderName={shipment.senderName}
                    receiverName={shipment.receiverName}
                    origin={shipment.origin}
                    destination={shipment.destination}
                    status={shipment.status}
                    date={shipment.createdAt}
                    weight={shipment.weight ? `${shipment.weight}` : undefined}
                    onClick={() => router.push(`/track?resi=${shipment.resi}`)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
