"use client";

import { useState } from "react";
import api from "../lib/api";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");

  const handleRegister = async () => {
    try {
      const res = await api.post("/User/register", {
        name,
        email,
        password,
        role,
      });

      alert(res.data.message);
      setIsLogin(true);
    } catch (err: any) {
      alert(err.response?.data || "Register gagal");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await api.post("/User/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("email", email);

      alert("Login berhasil");
      window.location.href = "/dashboard";
    } catch (err: any) {
      alert(err.response?.data || "Login gagal");
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 sm:py-12"
      style={{ backgroundColor: "#f4f7fb" }}
    >
      <div
        className="mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-jne"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
          <div className="relative overflow-hidden bg-jne-navy px-8 py-10 text-white sm:px-12 sm:py-16">
            <div className="absolute -right-24 top-8 hidden h-64 w-64 rounded-full bg-jne-red/20 blur-3xl md:block" />
            <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                JNE Mobile & Web
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl font-black leading-tight sm:text-6xl">
                  JNE Express
                </h1>
                <p className="max-w-xl text-lg leading-8 text-slate-200">
                  Pengiriman cepat, aman, dan terintegrasi untuk semua layanan JNE. Kelola pesanan dan tracking dengan pengalaman mobile/web yang modern.
                </p>
              </div>

              <div className="grid gap-4 pt-6">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-xl shadow-slate-950/10">
                  <p className="text-sm text-slate-100">🚚 Tracking pengiriman real-time</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-xl shadow-slate-950/10">
                  <p className="text-sm text-slate-100">📦 Manajemen shipment dan kurir</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-xl shadow-slate-950/10">
                  <p className="text-sm text-slate-100">📊 Laporan operasional profesional</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 px-8 py-10 sm:px-12 sm:py-16">
            <div className="max-w-md">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-jne-red">
                  Selamat datang di JNE
                </p>
                <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                  {isLogin ? "Masuk ke JNE" : "Daftar Akun JNE"}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Gunakan akun Anda untuk melihat dashboard pengiriman dan mengelola semua proses JNE dari satu tempat.
                </p>
              </div>

              {!isLogin && (
                <>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Nama lengkap</label>
                  <input
                    type="text"
                    placeholder="Nama lengkap"
                    className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-jne-red focus:ring-4 focus:ring-jne-red/10"
                    onChange={(e) => setName(e.target.value)}
                  />

                  <label className="mt-4 mb-2 block text-sm font-medium text-slate-700">Peran</label>
                  <select
                    className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-jne-red focus:ring-4 focus:ring-jne-red/10"
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option>User</option>
                    <option>Admin</option>
                    <option>Kurir</option>
                  </select>
                </>
              )}

              <label className="mt-4 mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-jne-red focus:ring-4 focus:ring-jne-red/10"
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className="mt-4 mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-jne-red focus:ring-4 focus:ring-jne-red/10"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={isLogin ? handleLogin : handleRegister}
                className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-jne-red px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-jne-red/20 transition hover:bg-[#c4000f] focus:outline-none focus:ring-4 focus:ring-jne-red/20"
              >
                {isLogin ? "Masuk" : "Daftar"}
              </button>

              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="mt-4 w-full text-sm font-semibold text-slate-700 transition hover:text-jne-red"
              >
                {isLogin ? "Belum punya akun? Daftar sekarang" : "Sudah punya akun? Masuk"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
