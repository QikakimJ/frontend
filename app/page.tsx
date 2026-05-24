"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

export default function Home() {
  const router = useRouter();
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
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data || "Register gagal"
        : "Register gagal";
      alert(message);
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
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data || "Login gagal"
        : "Login gagal";
      alert(message);
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
              {isLogin ? "Masuk ke JNE" : "Daftar Akun JNE"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Gunakan akun Anda untuk melihat dashboard pengiriman dan mengelola semua proses JNE dari satu tempat.
            </p>

            <div className="auth-form mt-10">
              {!isLogin && (
                <>
                  <label>Nama lengkap</label>
                  <input
                    type="text"
                    placeholder="Nama lengkap"
                    className="input-field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <label>Peran</label>
                  <select
                    className="select-field"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option>User</option>
                    <option>Admin</option>
                    <option>Kurir</option>
                  </select>
                </>
              )}

              <label>Email</label>
              <input
                type="email"
                placeholder="Email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label>Password</label>
              <input
                type="password"
                placeholder="Password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="button" onClick={isLogin ? handleLogin : handleRegister} className="btn-primary">
                {isLogin ? "Masuk" : "Daftar"}
              </button>

              <button type="button" onClick={() => setIsLogin(!isLogin)} className="btn-secondary">
                {isLogin ? "Belum punya akun? Daftar sekarang" : "Sudah punya akun? Masuk"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
