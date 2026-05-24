"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [role] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("role") : null
  );
  const [email] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("email") : null
  );

  const logout = () => {
    localStorage.clear();
    router.push("/");
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
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-jne-red">Halo, pengguna JNE</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">Selamat datang kembali!</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Gunakan dashboard ini untuk melihat status pengiriman dan mengelola operasional JNE secara cepat dan akurat.
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
          <div className="metric-card">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Tracking</p>
            <h3 className="mt-4 text-2xl font-bold">Cek paket</h3>
            <p className="mt-3 text-sm leading-6 text-slate-200/90">
              Lihat status paket sampai tujuan dengan update instan.
            </p>
          </div>

          <div className="metric-card secondary">
            <p className="text-sm uppercase tracking-[0.3em] text-white/90">Shipment</p>
            <h3 className="mt-4 text-2xl font-bold">Kelola order</h3>
            <p className="mt-3 text-sm leading-6 text-white/90">
              Buat, monitor, dan update detail pengiriman dengan mudah.
            </p>
          </div>

          <div className="metric-card">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Kurir</p>
            <h3 className="mt-4 text-2xl font-bold">Manajemen kurir</h3>
            <p className="mt-3 text-sm leading-6 text-slate-200/90">
              Atur pengiriman, rute, dan aktivitas kurir secara terpadu.
            </p>
          </div>

          <div className="metric-card light">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-900">Report</p>
            <h3 className="mt-4 text-2xl font-bold text-slate-900">Statistik</h3>
            <p className="mt-3 text-sm leading-6 text-slate-900/80">
              Laporan performa pengiriman untuk analisis cepat.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

