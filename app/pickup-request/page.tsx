"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import { useRouter } from "next/navigation";

export default function PickupRequest() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [myPickups, setMyPickups] = useState<any[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token || role !== "User") {
        router.push("/");
        return;
      }

      fetchMyPickups();
    };

    checkAuth();
  }, [router]);

  const fetchMyPickups = async () => {
    try {
      const response = await api.get("/Pickup/my-pickups");
      setMyPickups(response.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!address || !city || !phoneNumber || !scheduledDate) {
      setError("Semua field harus diisi");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post("/Pickup", {
        address,
        city,
        phoneNumber,
        scheduledDate,
        notes,
      });

      setMessage("✅ Request pickup berhasil dibuat!");
      setAddress("");
      setCity("");
      setPhoneNumber("");
      setScheduledDate("");
      setNotes("");
      
      setTimeout(() => {
        fetchMyPickups();
        setMessage("");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data || "Gagal membuat request pickup");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: string } = {
      Pending: "bg-yellow-100 text-yellow-800",
      Assigned: "bg-blue-100 text-blue-800",
      InProgress: "bg-purple-100 text-purple-800",
      Completed: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="main-shell page-shell min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-3xl font-bold mb-1">🚚 Request Pickup</h1>
        <p className="text-red-100">Minta kurir menjemput paket Anda</p>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Detail Pickup</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {message}
            </div>
          )}

          {/* Address */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📍 Alamat Lengkap
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jln. Contoh No. 123, RT 01/RW 02"
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition"
            />
          </div>

          {/* City */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🏘️ Kota
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Contoh: Jakarta Selatan"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition"
            />
          </div>

          {/* Phone */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📱 Nomor Telepon
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="08123456789"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition"
            />
          </div>

          {/* Scheduled Date */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📅 Tanggal & Waktu Pickup
            </label>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition"
            />
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📝 Catatan (Opsional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Paket ada di teras rumah, hubungi saya untuk masuk"
              rows={2}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Membuat Request..." : "✅ Buat Request Pickup"}
          </button>
        </div>

        {/* My Pickups */}
        {myPickups.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Request Pickup Saya</h2>
            <div className="space-y-3">
              {myPickups.map((pickup) => (
                <div
                  key={pickup.id}
                  className="p-4 border-2 border-gray-200 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{pickup.city}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(pickup.scheduledDate).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(
                        pickup.status
                      )}`}
                    >
                      {pickup.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{pickup.address}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
