"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

export default function Dashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipmentResult, setShipmentResult] = useState<any>(null);
  const [updateStatus, setUpdateStatus] = useState("Picked");
  const [loading, setLoading] = useState(false);
  const [shipments, setShipments] = useState<any[]>([]);
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [createMessage, setCreateMessage] = useState("");
  const [createdResi, setCreatedResi] = useState("");

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

    setRole(savedRole);
    setEmail(savedEmail);

    if (savedRole === "Admin" || savedRole === "Courier") {
      fetchNotifications();
    }
  }, [router]);

  const logout = () => {
    localStorage.clear();
    router.push("/");
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/Shipment");
      setShipments(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateShipment = async () => {
    if (!senderName || !receiverName || !origin || !destination) {
      setCreateMessage("Semua field pengiriman harus diisi.");
      return;
    }

    setLoading(true);
    setCreateMessage("");

    try {
      const response = await api.post("/Shipment", {
        senderName,
        receiverName,
        origin,
        destination,
      });

      setCreatedResi(response.data.resi);
      setCreateMessage("Resi berhasil dibuat. Simpan nomor berikut untuk tracking.");
      setSenderName("");
      setReceiverName("");
      setOrigin("");
      setDestination("");

      if (role === "Admin" || role === "Courier") {
        fetchNotifications();
      }
    } catch (error) {
      setCreateMessage("Gagal membuat resi baru. Pastikan data pengiriman valid.");
    } finally {
      setLoading(false);
    }
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
      fetchNotifications();
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
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">JNE Real Expert</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Dashboard Pengiriman Profesional</h1>
            <p className="mt-2 text-sm text-white/90 sm:text-base">
              Semua aktivitas role berada di satu tempat: buat resi, lacak paket, pantau status, dan kelola armada.
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
                  ? "Portal Admin JNE"
                  : role === "Courier"
                  ? "Portal Kurir JNE"
                  : "Selamat datang di JNE Express"}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {role === "Admin"
                  ? "Pantau paket baru, verifikasi resi user, dan lacak setiap pengiriman dari pusat kontrol."
                  : role === "Courier"
                  ? "Terima notifikasi pickup, update status rute, dan selesaikan pengiriman dengan cepat."
                  : "Buat pengiriman baru, terima nomor resi langsung, lalu lacak paket Anda kapan saja."}
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
                <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Notifikasi</p>
                <h3 className="mt-4 text-2xl font-bold">Resi Baru</h3>
                <p className="mt-3 text-sm leading-6 text-slate-200/90">
                  Lihat order user terbaru dan cek data paket yang masuk.
                </p>
              </div>
              <div className="metric-card secondary">
                <p className="text-sm uppercase tracking-[0.3em] text-white/90">Kontrol</p>
                <h3 className="mt-4 text-2xl font-bold">Review Paket</h3>
                <p className="mt-3 text-sm leading-6 text-white/90">
                  Kelola resi, status, dan konfirmasi pengiriman dengan mudah.
                </p>
              </div>
              <div className="metric-card light">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-900">Operasi</p>
                <h3 className="mt-4 text-2xl font-bold text-slate-900">Tim Pengiriman</h3>
                <p className="mt-3 text-sm leading-6 text-slate-900/80">
                  Sinkronisasi informasi paket antara user, admin, dan kurir.
                </p>
              </div>
            </>
          ) : role === "Courier" ? (
            <>
              <div className="metric-card">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Pickup</p>
                <h3 className="mt-4 text-2xl font-bold">Jadwal Harian</h3>
                <p className="mt-3 text-sm leading-6 text-slate-200/90">
                  Ikuti notifikasi paket baru dan siapkan penjemputan tepat waktu.
                </p>
              </div>
              <div className="metric-card secondary">
                <p className="text-sm uppercase tracking-[0.3em] text-white/90">Perjalanan</p>
                <h3 className="mt-4 text-2xl font-bold">Update Status</h3>
                <p className="mt-3 text-sm leading-6 text-white/90">
                  Jalur paket sampai diterima user B, catat setiap perubahan status.
                </p>
              </div>
              <div className="metric-card light">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-900">Tracking</p>
                <h3 className="mt-4 text-2xl font-bold text-slate-900">Performance</h3>
                <p className="mt-3 text-sm leading-6 text-slate-900/80">
                  Pastikan semua paket bergerak lancar dari titik pickup hingga drop-off.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="metric-card">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Pengiriman</p>
                <h3 className="mt-4 text-2xl font-bold">Buat Paket Baru</h3>
                <p className="mt-3 text-sm leading-6 text-slate-200/90">
                  Input data pengirim dan penerima lalu dapatkan nomor resi otomatis.
                </p>
              </div>
              <div className="metric-card secondary">
                <p className="text-sm uppercase tracking-[0.3em] text-white/90">Resi</p>
                <h3 className="mt-4 text-2xl font-bold">Tracking Mudah</h3>
                <p className="mt-3 text-sm leading-6 text-white/90">
                  Gunakan nomor resi untuk melacak paket kapan saja dalam dashboard.
                </p>
              </div>
              <div className="metric-card">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Layanan</p>
                <h3 className="mt-4 text-2xl font-bold">Support JNE</h3>
                <p className="mt-3 text-sm leading-6 text-slate-200/90">
                  Pengiriman terpantau, paket terjaga, dan informasi tiba lebih cepat.
                </p>
              </div>
            </>
          )}
        </section>

        <section className="dashboard-panel p-8">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-jne-red">Aktivitas</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">Flow setiap role</h2>
            </div>

            {role === "User" && (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-500">Buat Resi Paket Baru</p>
                <div className="grid gap-4 mt-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Nama Pengirim"
                    className="input-field"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Nama Penerima"
                    className="input-field"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Asal Paket"
                    className="input-field"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Tujuan Paket"
                    className="input-field"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={handleCreateShipment} className="btn-primary" disabled={loading}>
                    {loading ? "Membuat resi..." : "Buat Resi Baru"}
                  </button>
                  {createdResi && (
                    <button
                      type="button"
                      onClick={() => {
                        setTrackingNumber(createdResi);
                        setShipmentResult(null);
                        setStatusMessage("");
                      }}
                      className="btn-secondary"
                    >
                      Gunakan Resi {createdResi}
                    </button>
                  )}
                </div>
                {createMessage && (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                    {createMessage}
                    {createdResi && <div className="mt-2 font-semibold">Resi: {createdResi}</div>}
                  </div>
                )}
              </div>
            )}

            {(role === "Admin" || role === "Courier") && (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Notifikasi Resi Baru</p>
                    <p className="mt-1 text-sm text-slate-600">Paket terbaru yang dibuat oleh user.</p>
                  </div>
                  <button type="button" onClick={fetchNotifications} className="btn-secondary">
                    Refresh
                  </button>
                </div>
                <div className="mt-5 space-y-4">
                  {shipments.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">Belum ada paket baru.</div>
                  ) : (
                    shipments.slice(0, 5).map((item) => (
                      <div key={item.resi} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-slate-900">{item.resi}</p>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{item.status}</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{item.senderName} → {item.receiverName}</p>
                        <p className="text-sm text-slate-500">{item.origin} → {item.destination}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3 rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">Lacak Paket</p>
                  <input
                    type="text"
                    placeholder="Masukkan nomor resi"
                    className="input-field"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                  <button type="button" onClick={handleTrackShipment} className="btn-primary" disabled={loading}>
                    {loading ? "Memeriksa..." : "Cek Status"}
                  </button>
                </div>

                {role === "Courier" && (
                  <div className="space-y-3 rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm font-medium text-slate-500">Update Status Kurir</p>
                    <select
                      className="select-field"
                      value={updateStatus}
                      onChange={(e) => setUpdateStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Picked">Picked</option>
                      <option value="On Delivery">On Delivery</option>
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
                  <p className="mt-1 text-sm text-slate-600">Penerima: {shipmentResult.receiverName || "-"}</p>
                  <p className="mt-1 text-sm text-slate-600">Asal: {shipmentResult.origin || "-"}</p>
                  <p className="mt-1 text-sm text-slate-600">Tujuan: {shipmentResult.destination || "-"}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

