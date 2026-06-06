"use client";

import axios from "axios";
import { useState } from "react";
import api from "../../lib/api";
import { useRouter } from "next/navigation";
import { AppLayout } from "../../components/ui/AppLayout";
import { motion } from "framer-motion";
import { Zap, MapPin, Weight, Package, ArrowRight, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

interface ShippingCostResult {
  origin: string;
  destination: string;
  weight: number;
  service?: string;
  etd?: string;
  price?: number;
}

const services = [
  { id: "REG", name: "Regular", desc: "Pengiriman standar", icon: Package, duration: "2-3 hari", color: "from-blue-500 to-blue-700" },
  { id: "OKE", name: "OKE", desc: "Pengiriman cepat", icon: Zap, duration: "1-2 hari", color: "from-amber-500 to-amber-700" },
  { id: "SAME-DAY", name: "Same Day", desc: "Hari yang sama", icon: TrendingUp, duration: "< 24 jam", color: "from-red-500 to-red-700" },
];

export default function ShippingCalculator() {
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState("");
  const [service, setService] = useState("REG");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShippingCostResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = async () => {
    if (!origin || !destination || !weight) {
      setError("Semua field harus diisi");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await api.post("/ShippingCost/calculate", {
        origin,
        destination,
        weight: parseFloat(weight),
        service,
      });

      setResult(response.data);
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || "Gagal menghitung ongkir"
        : "Gagal menghitung ongkir";
      setError(String(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCalculate();
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
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
            Cek Ongkir
          </h1>
          <p className="text-slate-600 mt-2">
            Hitung biaya pengiriman Anda dengan cepat dan akurat
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="lg:col-span-2 space-y-6"
          >
            {/* Input Card */}
            <div className="card">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Detail Pengiriman</h2>

              <div className="space-y-5">
                {/* Origin */}
                <div>
                  <label className="form-label">Kota Asal</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="Contoh: Jakarta, Bandung"
                      className="form-input pl-10"
                    />
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <label className="form-label">Kota Tujuan</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 rotate-45" size={20} />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Contoh: Surabaya, Medan"
                      className="form-input pl-10"
                    />
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <label className="form-label">Berat Paket (kg)</label>
                  <div className="relative">
                    <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Contoh: 2.5"
                      step="0.1"
                      min="0"
                      className="form-input pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Service Selection */}
            <div className="card">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Pilih Layanan</h3>
              <div className="grid gap-3">
                {services.map((svc) => {
                  const Icon = svc.icon;
                  const isSelected = service === svc.id;
                  return (
                    <motion.button
                      key={svc.id}
                      onClick={() => setService(svc.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? "border-red-600 bg-red-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${svc.color} rounded-lg flex items-center justify-center text-white`}>
                            <Icon size={20} />
                          </div>
                          <div>
                            <p className={`font-semibold ${isSelected ? "text-red-700" : "text-slate-900"}`}>
                              {svc.name}
                            </p>
                            <p className="text-sm text-slate-600">{svc.desc}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-slate-500">{svc.duration}</p>
                          {isSelected && (
                            <CheckCircle size={20} className="text-red-600 mt-1" />
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
              >
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full btn btn--primary btn--lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Menghitung...</span>
                </>
              ) : (
                <>
                  <Zap size={20} />
                  <span>Hitung Ongkir</span>
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Tips Card */}
            <div className="card card--gradient-secondary text-white">
              <h3 className="text-lg font-bold mb-4">💡 Tips Pengiriman</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Pastikan berat paket sudah akurat</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Pilih layanan sesuai kebutuhan</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Biaya dapat berubah sewaktu-waktu</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Verifikasi alamat penerima</span>
                </li>
              </ul>
            </div>

            {/* Service Info */}
            <div className="card">
              <h3 className="text-lg font-bold text-slate-900 mb-4">ℹ️ Info Layanan</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Regular:</span> Pengiriman standar dengan harga terjangkau
                </p>
                <p>
                  <span className="font-semibold text-slate-900">OKE:</span> Pengiriman cepat untuk kebutuhan mendesak
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Same Day:</span> Pengiriman super cepat kota yang sama
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Result Section */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card card--gradient-secondary text-white"
          >
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">✅ Hasil Perhitungan</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-white/20">
                    <span className="opacity-75">Dari:</span>
                    <span className="font-semibold">{result.origin}</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/20">
                    <span className="opacity-75">Ke:</span>
                    <span className="font-semibold">{result.destination}</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/20">
                    <span className="opacity-75">Berat:</span>
                    <span className="font-semibold">{result.weight} kg</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/20">
                    <span className="opacity-75">Layanan:</span>
                    <span className="font-semibold">{result.service}</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/20">
                    <span className="opacity-75">Estimasi:</span>
                    <span className="font-semibold">{result.etd}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div className="text-center py-8 bg-white/10 rounded-lg">
                  <p className="text-sm opacity-75 mb-2">TOTAL BIAYA</p>
                  <h3 className="text-4xl font-bold">
                    Rp {result.price?.toLocaleString("id-ID") || 0}
                  </h3>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    router.push("/dashboard");
                  }}
                  className="bg-white text-red-600 font-bold py-3 px-6 rounded-lg hover:bg-slate-100 transition flex items-center justify-center gap-2"
                >
                  <ArrowRight size={20} />
                  Lanjut Buat Pengiriman
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
