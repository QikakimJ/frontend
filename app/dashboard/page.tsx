"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

export default function Dashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const normalizeRole = (value: string | null) => {
    const normalized = value?.toLowerCase();
    if (normalized === "courier" || normalized === "kurir") return "Courier";
    if (normalized === "admin") return "Admin";
    if (normalized === "user") return "User";
    return value;
  };
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

  const handleCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleCreateShipment();
  };

  const handleCreateShipment = async () => {
    if (!senderName || !receiverName || !origin || !destination) {
      setCreateMessage("Semua field pengiriman harus diisi.");
      return;
    }

    if (role !== "User") {
      setCreateMessage("Hanya role User yang dapat membuat resi.");
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
    } catch (error) {
      setCreateMessage("Gagal membuat resi baru. Pastikan data pengiriman valid.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleTrackShipment();
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
      setShipmentResult(response.data.shipment ?? response.data);
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
      await handleTrackShipment();
    } catch (error) {
      setStatusMessage("Gagal memperbarui status pengiriman.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-shell page-shell">
      <section className="dashboard-banner">
        <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">JNE Express Expert</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Dashboard Pengiriman Profesional</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              Kelola resi, monitoring paket, dan update status dengan tampilan JNE yang modern dan responsif.
            </p>
          </div>
          <div className="hero-summary-card">
            <p className="hero-summary-card__label">Role Aktif</p>
            <h2 className="hero-summary-card__role">{role || "Guest"}</h2>
            <p className="hero-summary-card__text">
              {role === "Admin"
                ? "Kelola notifikasi dan kontrol pengiriman."
                : role === "Courier"
                ? "Terima resi, cek status, dan update paket."
                : "Buat resi baru dan lacak paket Anda."}
            </p>
            <div className="hero-summary-card__meta">
              <span>{email || "Email tidak tersedia"}</span>
              <span>{role === "User" ? "Pembuatan resi" : role === "Courier" ? "Update paket" : "Monitoring"}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <div className="feature-card feature-card--blue">
          <div className="feature-card__label">PENGIRIMAN</div>
          <h3>Buat Paket Baru</h3>
          <p>Input data pengirim dan penerima lalu dapatkan nomor resi otomatis.</p>
        </div>
        <div className="feature-card feature-card--red">
          <div className="feature-card__label">RESI</div>
          <h3>Tracking Mudah</h3>
          <p>Gunakan nomor resi untuk melacak paket kapan saja dalam dashboard.</p>
        </div>
        <div className="feature-card feature-card--yellow">
          <div className="feature-card__label">LAYANAN</div>
          <h3>Support JNE</h3>
          <p>Pengiriman terpantau, paket terjaga, dan informasi tiba lebih cepat.</p>
        </div>
      </section>

      <section className="dashboard-panel p-8">
        <div className="section-heading">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-jne-red">Aktivitas</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">Flow setiap role</h2>
          </div>
          <p className="max-w-2xl text-sm text-slate-600">
            Fitur sesuai peran: user buat resi, courier cek resi, admin pantau notifikasi dan kontrol pengiriman.
          </p>
        </div>

        <div className="activity-grid">
          <div className="activity-column">
            {role === "User" ? (
              <div className="action-panel action-panel--user">
                <div className="action-panel__header">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Buat Resi Baru</p>
                  <h3 className="mt-3 text-2xl font-bold text-white">Isi data paket Anda</h3>
                </div>
                <div className="action-panel__body">
                  <form onSubmit={handleCreateSubmit} className="space-y-4">
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
                    <button type="submit" className="btn-primary mt-6" disabled={loading}>
                      {loading ? "Membuat resi..." : "Buat Resi Baru"}
                    </button>
                  </form>
                  {createdResi && (
                    <div className="status-banner mt-4">
                      <p className="font-semibold">Resi berhasil dibuat</p>
                      <p className="mt-1 text-sm">Nomor resi: <span className="font-bold">{createdResi}</span></p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="action-panel action-panel--notify">
                <div className="action-panel__header">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Notifikasi Resi Baru</p>
                  <h3 className="mt-3 text-2xl font-bold text-white">Paket terbaru dari user</h3>
                </div>
                <div className="action-panel__body">
                  <button type="button" onClick={fetchNotifications} className="btn-secondary w-full mb-4">
                    Refresh Notifikasi
                  </button>
                  <div className="notification-list">
                    {shipments.length === 0 ? (
                      <div className="notification-card">Belum ada paket baru.</div>
                    ) : (
                      shipments.slice(0, 5).map((item) => (
                        <div key={item.resi} className="notification-card">
                          <div className="notification-card__top">
                            <span className="notification-card__resi">{item.resi}</span>
                            <span className="status-pill">{item.status}</span>
                          </div>
                          <p className="text-sm text-slate-600">{item.senderName} → {item.receiverName}</p>
                          <p className="text-xs text-slate-500 mt-1">{item.origin} → {item.destination}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="activity-column">
            <div className="action-panel action-panel--track">
              <div className="action-panel__header">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Lacak Paket</p>
                <h3 className="mt-3 text-2xl font-bold text-white">Masukkan nomor resi</h3>
              </div>
              <div className="action-panel__body">
                <form onSubmit={handleTrackSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Masukkan nomor resi"
                    className="input-field"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                  <button type="submit" className="btn-primary mt-4" disabled={loading}>
                    {loading ? "Memeriksa..." : "Cek Status"}
                  </button>
                </form>

                {role === "Courier" && shipmentResult && (
                  <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-500">Update Status Kurir</p>
                    <select
                      className="select-field mt-3"
                      value={updateStatus}
                      onChange={(e) => setUpdateStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Picked">Picked</option>
                      <option value="On Delivery">On Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                    <button type="button" onClick={handleCourierUpdate} className="btn-secondary mt-4" disabled={loading}>
                      {loading ? "Memproses..." : "Update Status"}
                    </button>
                  </div>
                )}

                {role === "Courier" && !shipmentResult && (
                  <div className="status-note mt-4">Masukkan nomor resi dan klik Cek Status untuk menampilkan update posisi paket.</div>
                )}

                {statusMessage && (
                  <div className="status-note status-note--warn mt-4">{statusMessage}</div>
                )}

                {shipmentResult && (
                  <div className="shipment-card mt-5">
                    <div className="shipment-card__title">Detail Resi</div>
                    <div className="shipment-card__row">
                      <span>Resi</span>
                      <strong>{shipmentResult.resi || trackingNumber}</strong>
                    </div>
                    <div className="shipment-card__row">
                      <span>Status</span>
                      <strong>{shipmentResult.status}</strong>
                    </div>
                    <div className="shipment-card__row">
                      <span>Pengirim</span>
                      <strong>{shipmentResult.senderName || "-"}</strong>
                    </div>
                    <div className="shipment-card__row">
                      <span>Penerima</span>
                      <strong>{shipmentResult.receiverName || "-"}</strong>
                    </div>
                    <div className="shipment-card__row">
                      <span>Rute</span>
                      <strong>{shipmentResult.origin || "-"} → {shipmentResult.destination || "-"}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

