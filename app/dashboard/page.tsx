"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

export default function Dashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipmentResult, setShipmentResult] = useState<any>(null);
  const [updateStatus, setUpdateStatus] = useState("Delivered");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedEmail = localStorage.getItem("email");

    if (!savedToken) {
      router.push("/");
      return;
    }

    setToken(savedToken);
    setRole(savedRole);
    setEmail(savedEmail);
  }, [router]);

  const logout = () => {
    localStorage.clear();
    router.push("/");
  };

  const handleTrackShipment = async () => {
    if (!trackingNumber) {
      setStatusMessage("Masukkan nomor resi terlebih dahulu.");
      return;
    }

    setLoading(true);
    setStatusMessage("");
    setShipmentResult(null);

    try {
      const response = await api.get(`/Shipment/track/${trackingNumber}`);
      setShipmentResult(response.data);
    } catch (error) {
      setStatusMessage("Tidak dapat menemukan detail pengiriman. Periksa nomor resi.");
    } finally {
      setLoading(false);
    }
  };

  const handleCourierUpdate = async () => {
    if (!trackingNumber) {
      setStatusMessage("Masukkan nomor resi untuk update status.");
      return;
    }

    setLoading(true);
    setStatusMessage("");

    try {
      await api.put(`/Shipment/update/${trackingNumber}`, {
        status: updateStatus,
      });
      setStatusMessage("Status pengiriman berhasil diperbarui.");
    } catch (error) {
      setStatusMessage("Gagal memperbarui status pengiriman.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-shell page-shell">
      <section className="dashboard-banner">
        <div className="max-w-6xl mx-auto flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">Dashboard JNE</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Akses Pengiriman JNE</h1>
            <p className="mt-2 text-sm text-white/90 sm:text-base">
              Pantau semua proses pengiriman, laporan, dan aktivitas kurir dalam satu tempat.
            </p>
          </div>
          <button type="button" onClick={logout} className="btn-secondary text-white border-white/25 bg-white/10 hover:bg-white/20">
            Logout
          </button>
        </div>
      </section>

      <div className="max-w-6xl mx-auto grid gap-6">
        <section className="dashboard-panel p-8">
          <div className="dashboard-overview">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-jne-red">Halo, {role || "Pengguna"}</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {role === "Admin"
                  ? "Kelola Operasi JNE"
                  : role === "Courier"
                  ? "Dashboard Kurir"
                  : "Selamat datang di JNE Express"}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {role === "Admin"
                  ? "Akses semua laporan, kelola shipment, dan atur peran pengguna dari satu tempat."
                  : role === "Courier"
                  ? "Terima tugas pengiriman, update status paket, dan cek rute harian Anda."
                  : "Lacak paket, lihat riwayat pengiriman, dan kelola pesanan Anda dengan mudah."}
              </p>
            </div>
            <div className="info-panel">
              <p className="text-sm text-slate-500">Email</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{email || "Belum login"}</p>
              <p className="mt-4 text-sm text-slate-500">Peran</p>
              <p className="mt-2 text-lg font-semibold text-jne-red">{role || "Tamu"}</p>
            </div>
          </div>
        </section>

        <section className="stats-grid">
          {role === "Admin" ? (
            <>
              <div className="metric-card">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Admin</p>
                <h3 className="mt-4 text-2xl font-bold">Kelola Shipment</h3>
                <p className="mt-3 text-sm leading-6 text-slate-200/90">
                  Tambah, edit, atau hapus pengiriman dan pantau aktivitas kurir.
                </p>
              </div>
              <div className="metric-card secondary">
                <p className="text-sm uppercase tracking-[0.3em] text-white/90">Pengaturan</p>
                <h3 className="mt-4 text-2xl font-bold">Manajemen Kurir</h3>
                <p className="mt-3 text-sm leading-6 text-white/90">
                  Atur peran, akses, dan tanggung jawab untuk tim logistik Anda.
                </p>
              </div>
              <div className="metric-card">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Laporan</p>
                <h3 className="mt-4 text-2xl font-bold">Statistik Kinerja</h3>
                <p className="mt-3 text-sm leading-6 text-slate-200/90">
                  Tinjau laporan pengiriman dan efisiensi operasional harian.
                </p>
              </div>
            </>
          ) : role === "Courier" ? (
            <>
              <div className="metric-card">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Kurir</p>
                <h3 className="mt-4 text-2xl font-bold">Tugas Harian</h3>
                <p className="mt-3 text-sm leading-6 text-slate-200/90">
                  Lihat dan update status pengiriman secara real-time.
                </p>
              </div>
              <div className="metric-card secondary">
                <p className="text-sm uppercase tracking-[0.3em] text-white/90">Update</p>
                <h3 className="mt-4 text-2xl font-bold">Catat Pengiriman</h3>
                <p className="mt-3 text-sm leading-6 text-white/90">
                  Perbarui status paket dari pickup sampai diterima pelanggan.
                </p>
              </div>
              <div className="metric-card light">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-900">Rute</p>
                <h3 className="mt-4 text-2xl font-bold text-slate-900">Orders Saya</h3>
                <p className="mt-3 text-sm leading-6 text-slate-900/80">
                  Akses daftar pengiriman dan status tugas Anda saat ini.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="metric-card">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Pengguna</p>
                <h3 className="mt-4 text-2xl font-bold">Cek Resi</h3>
                <p className="mt-3 text-sm leading-6 text-slate-200/90">
                  Lacak status paket Anda kapan saja dan di mana saja.
                </p>
              </div>
              <div className="metric-card secondary">
                <p className="text-sm uppercase tracking-[0.3em] text-white/90">Pesanan</p>
                <h3 className="mt-4 text-2xl font-bold">Pengiriman Saya</h3>
                <p className="mt-3 text-sm leading-6 text-white/90">
                  Lihat riwayat pesanan dan status paket secara lengkap.
                </p>
              </div>
              <div className="metric-card">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Akses</p>
                <h3 className="mt-4 text-2xl font-bold">Dukungan</h3>
                <p className="mt-3 text-sm leading-6 text-slate-200/90">
                  Hubungi tim support JNE jika Anda membutuhkan bantuan cepat.
                </p>
              </div>
            </>
          )}
        </section>

        <section className="dashboard-panel p-8">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-jne-red">Tools</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">Aksi Cepat</h2>
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3 rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">Lacak Paket</p>
                  <input
                    type="text"
                    placeholder="Nomor resi"
                    className="input-field"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                  <button type="button" onClick={handleTrackShipment} className="btn-primary" disabled={loading}>
                    {loading ? "Memuat..." : "Cek Status"}
                  </button>
                </div>

                {role === "Courier" && (
                  <div className="space-y-3 rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm font-medium text-slate-500">Update Kurir</p>
                    <select
                      className="select-field"
                      value={updateStatus}
                      onChange={(e) => setUpdateStatus(e.target.value)}
                    >
                      <option value="On the way">On the way</option>
                      <option value="Picked up">Picked up</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                    <button type="button" onClick={handleCourierUpdate} className="btn-secondary" disabled={loading}>
                      {loading ? "Memproses..." : "Update Status"}
                    </button>
                  </div>
                )}
              </div>

              {statusMessage && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  {statusMessage}
                </div>
              )}

              {shipmentResult && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-500">Detail Resi</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900">{shipmentResult.resi || trackingNumber}</p>
                  <p className="mt-2 text-sm text-slate-600">Status: {shipmentResult.status}</p>
                  <p className="mt-1 text-sm text-slate-600">Pengirim: {shipmentResult.senderName || "-"}</p>
                  <p className="mt-1 text-sm text-slate-600">Penerima: {shipmentResult.recipientName || "-"}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

