"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

const roles = [
  { value: "User", label: "User" },
  { value: "Admin", label: "Admin" },
  { value: "Courier", label: "Kurir" },
];

const normalizeRole = (value: string) => {
  const normalized = value?.toLowerCase();
  if (normalized === "courier" || normalized === "kurir") return "Courier";
  if (normalized === "admin") return "Admin";
  if (normalized === "user") return "User";
  return value;
};

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/User/register", {
        name,
        email,
        password,
        role,
      });

      setMessage(res.data.message);
      setIsLogin(true);
      setPassword("");
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data || "Register gagal"
        : "Register gagal";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/User/login", {
        email,
        password,
      });

      const normalizedRole = normalizeRole(res.data.role);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", normalizedRole);
      localStorage.setItem("email", email);

      setMessage("Login berhasil. Mengarahkan ke dashboard...");
      router.push("/dashboard");
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data || "Login gagal"
        : "Login gagal";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-shell page-shell">
      <div className="page-grid">
        <section className="hero-panel p-10 text-white">
          <div className="badge">JNE Mobile & Web</div>

          <div className="mt-8 space-y-6">
            <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl">
              JNE Express
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-200">
              Pengiriman cepat, aman, dan terintegrasi untuk semua layanan JNE. Kelola pesanan dan tracking dengan pengalaman mobile/web yang modern.
            </p>
          </div>

          <div className="mt-10 grid gap-4">
            <div className="feature-chip">🚚 Tracking pengiriman real-time</div>
            <div className="feature-chip">📦 Manajemen shipment dan kurir</div>
            <div className="feature-chip">📊 Laporan operasional profesional</div>
          </div>
        </section>

        <section className="auth-panel p-10">
          <div className="max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-jne-red">
              Selamat datang di JNE
            </p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              {isLogin ? "Masuk ke JNE" : "Buat Akun Baru"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {isLogin
                ? "Masuk untuk mengelola pengiriman dan melihat dashboard JNE."
                : "Daftar akun baru untuk mulai menggunakan fitur tracking dan manajemen shipment."}
            </p>

            <div className="auth-form mt-10 space-y-6">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Nama lengkap</label>
                    <input
                      type="text"
                      placeholder="Nama lengkap"
                      className="input-field"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Peran</label>
                    <select
                      className="select-field"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      {roles.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {message && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  {message}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={isLogin ? handleLogin : handleRegister}
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (isLogin ? "Memproses login..." : "Memproses registrasi...") : isLogin ? "Masuk" : "Daftar"}
                </button>

                <button type="button" onClick={() => setIsLogin(!isLogin)} className="btn-secondary">
                  {isLogin ? "Belum punya akun? Daftar sekarang" : "Sudah punya akun? Masuk"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
