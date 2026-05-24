"use client";

export default function Dashboard() {
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-50" style={{ backgroundColor: "#f4f7fb" }}>
      <div className="bg-jne-red px-6 py-6 shadow-jne text-white sm:px-8" style={{ backgroundColor: "#E70012" }}>
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">Dashboard JNE</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Akses Pengiriman JNE</h1>
            <p className="mt-2 text-sm text-white/90 sm:text-base">
              Pantau semua proses pengiriman, laporan, dan aktivitas kurir dalam satu tempat.
            </p>
          </div>

          <button
            onClick={logout}
            className="inline-flex rounded-3xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-[2rem] bg-white p-8 shadow-jne">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-jne-red">Halo, pengguna JNE</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">Selamat datang kembali!</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">Gunakan dashboard ini untuk melihat status pengiriman dan mengelola operasional JNE secara cepat dan akurat.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Email</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{email || "Belum login"}</p>
              <p className="mt-4 text-sm text-slate-500">Peran</p>
              <p className="mt-2 text-lg font-semibold text-jne-red">{role || "Tamu"}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[2rem] bg-jne-navy p-8 text-white shadow-jne transition hover:-translate-y-1">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Tracking</p>
            <h3 className="mt-4 text-2xl font-bold">Cek paket</h3>
            <p className="mt-3 text-sm leading-6 text-slate-200/90">Lihat status paket sampai tujuan dengan update instan.</p>
          </div>

          <div className="rounded-[2rem] bg-jne-red p-8 text-white shadow-jne transition hover:-translate-y-1">
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">Shipment</p>
            <h3 className="mt-4 text-2xl font-bold">Kelola order</h3>
            <p className="mt-3 text-sm leading-6 text-white/90">Buat, monitor, dan update detail pengiriman dengan mudah.</p>
          </div>

          <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-jne transition hover:-translate-y-1">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Kurir</p>
            <h3 className="mt-4 text-2xl font-bold">Manajemen kurir</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300/90">Atur pengiriman, rute, dan aktivitas kurir secara terpadu.</p>
          </div>

          <div className="rounded-[2rem] bg-jne-gold p-8 shadow-jne transition hover:-translate-y-1">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-900">Report</p>
            <h3 className="mt-4 text-2xl font-bold text-slate-900">Statistik</h3>
            <p className="mt-3 text-sm leading-6 text-slate-900/80">Laporan performa pengiriman untuk analisis cepat.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

