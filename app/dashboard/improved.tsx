"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

export default function Dashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedEmail = localStorage.getItem("email");

    if (!savedToken) {
      router.push("/");
      return;
    }

    setRole(savedRole);
    setEmail(savedEmail);
    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/User/profile");
      setName(response.data.name);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    router.push(`/track/${trackingNumber}`);
  };

  const logout = () => {
    localStorage.clear();
    router.push("/");
  };

  const getMenuItems = () => {
    const commonItems = [
      {
        title: "🔍 Tracking Publik",
        desc: "Lacak paket dengan nomor resi",
        action: () => router.push("/track"),
        color: "from-blue-600 to-blue-700",
      },
    ];

    if (role === "User") {
      return [
        {
          title: "📦 Paket Saya",
          desc: "Lihat semua pengiriman Anda",
          action: () => router.push("/my-shipments"),
          color: "from-red-600 to-red-700",
        },
        {
          title: "🧮 Cek Ongkir",
          desc: "Hitung biaya pengiriman",
          action: () => router.push("/shipping-cost"),
          color: "from-orange-600 to-orange-700",
        },
        {
          title: "🚚 Request Pickup",
          desc: "Minta kurir jemput paket",
          action: () => router.push("/pickup-request"),
          color: "from-purple-600 to-purple-700",
        },
        ...commonItems,
      ];
    } else if (role === "Admin") {
      return [
        {
          title: "📊 Analytics",
          desc: "Dashboard statistik operasional",
          action: () => router.push("/analytics"),
          color: "from-green-600 to-green-700",
        },
        ...commonItems,
      ];
    }

    return commonItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-red-600">JNE Express</h1>
            <p className="text-xs text-gray-500">{role}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* Header with Quick Track */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <p className="text-sm opacity-90 mb-2">Selamat datang kembali 👋</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              {name ? `Halo, ${name}!` : "Dashboard JNE Express"}
            </h2>
          </div>

          {/* Quick Track Form */}
          <form onSubmit={handleQuickTrack} className="flex gap-2">
            <input
              type="text"
              placeholder="🔍 Masukkan nomor resi untuk tracking..."
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition"
            >
              Cek
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
        {/* Features Grid */}
        {menuItems.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">📍 Fitur Utama</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.action}
                  className={`bg-gradient-to-br ${item.color} text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition transform hover:scale-105 text-left`}
                >
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-sm opacity-90">{item.desc}</p>
                  <div className="mt-4 text-sm opacity-75">➜ Klik untuk akses</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Account Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-l-4 border-red-600">
          <h3 className="text-lg font-bold text-gray-900 mb-4">👤 Informasi Akun</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">NAMA</p>
              <p className="font-semibold text-gray-900">{name || "Loading..."}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">EMAIL</p>
              <p className="font-semibold text-gray-900 break-all">{email || "Loading..."}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">ROLE</p>
              <p className="font-semibold text-red-600 text-lg">{role || "Loading..."}</p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-2xl p-6 border-l-4 border-blue-600">
            <h4 className="font-bold text-gray-900 mb-2">💡 Tips</h4>
            <p className="text-sm text-gray-700">Gunakan nomor resi 13 digit untuk tracking akurat</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-6 border-l-4 border-green-600">
            <h4 className="font-bold text-gray-900 mb-2">📞 Dukungan</h4>
            <p className="text-sm text-gray-700">Hubungi kami untuk pertanyaan pengiriman</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-6 border-l-4 border-purple-600">
            <h4 className="font-bold text-gray-900 mb-2">🔐 Keamanan</h4>
            <p className="text-sm text-gray-700">Data Anda aman dan terlindungi</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 text-gray-600 border-t">
          <p className="text-sm">
            JNE Express © 2026 - Pengiriman Cepat & Terpercaya
          </p>
          <p className="text-xs mt-2 opacity-75">
            Untuk informasi lebih lanjut, kunjungi www.jne.co.id
          </p>
        </div>
      </div>
    </div>
  );
}
