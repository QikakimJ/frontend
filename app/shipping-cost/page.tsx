"use client";

import { useState } from "react";
import api from "../../lib/api";
import { useRouter } from "next/navigation";

export default function ShippingCalculator() {
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState("");
  const [service, setService] = useState("REG");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
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
    } catch (err: any) {
      setError(err.response?.data || "Gagal menghitung ongkir");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-shell page-shell min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">🚚 Cek Ongkir</h1>
        <p className="text-red-100">Hitung biaya pengiriman Anda dengan mudah</p>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-600">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Detail Pengiriman</h2>

          {/* Origin */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📍 Kota Asal
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Contoh: Jakarta, Bandung"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition"
            />
          </div>

          {/* Destination */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📍 Kota Tujuan
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Contoh: Surabaya, Medan"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition"
            />
          </div>

          {/* Weight */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ⚖️ Berat Paket (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Contoh: 2.5"
              step="0.1"
              min="0"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition"
            />
          </div>

          {/* Service Type */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📦 Jenis Layanan
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "REG", label: "Regular", etd: "2 hari" },
                { value: "OKE", label: "OKE", etd: "1 hari" },
                { value: "SAME-DAY", label: "Same Day", etd: "Hari ini" },
              ].map((svc) => (
                <button
                  key={svc.value}
                  onClick={() => setService(svc.value)}
                  className={`p-3 rounded-lg border-2 transition font-medium ${
                    service === svc.value
                      ? "border-red-600 bg-red-50 text-red-700"
                      : "border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  {svc.label}
                  <div className="text-xs opacity-75">{svc.etd}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Menghitung..." : "🧮 Hitung Ongkir"}
          </button>
        </div>

        {/* Result Card */}
        {result && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
            <h2 className="text-xl font-bold mb-4 text-gray-800">✅ Hasil Perhitungan</h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Dari:</span>
                <span className="font-semibold text-gray-900">{result.origin}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Ke:</span>
                <span className="font-semibold text-gray-900">{result.destination}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Berat:</span>
                <span className="font-semibold text-gray-900">{result.weight} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Layanan:</span>
                <span className="font-semibold text-gray-900">{result.service}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Estimasi:</span>
                <span className="font-semibold text-gray-900">{result.etd}</span>
              </div>

              <div className="border-t-2 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total Biaya:</span>
                  <span className="text-3xl font-bold text-red-600">
                    Rp {result.price?.toLocaleString("id-ID") || 0}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full mt-4 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
            >
              ➡️ Lanjut Buat Pengiriman
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
