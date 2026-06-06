"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import { normalizeRole } from "../lib/auth";
import { PasswordInput } from "../components/ui/PasswordInput";
import { motion } from "framer-motion";
import { Package, Truck, BarChart3, Lock, Mail, User, ChevronRight } from "lucide-react";

const roles = [
  { value: "User", label: "Pengguna" },
  { value: "Admin", label: "Administrator" },
  { value: "Courier", label: "Kurir" },
  { value: "Supervisor", label: "Supervisor" },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
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
  const [messageType, setMessageType] = useState<"success" | "error">("error");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setMessage("Semua field harus diisi");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/User/register", {
        name,
        email,
        password,
        role,
      });

      setMessage(res.data.message || "Registrasi berhasil! Silakan login.");
      setMessageType("success");
      setTimeout(() => {
        setIsLogin(true);
        setPassword("");
        setName("");
        setEmail("");
      }, 1500);
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data || "Registrasi gagal"
        : "Registrasi gagal";
      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Email dan password harus diisi");
      setMessageType("error");
      return;
    }

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
      localStorage.setItem("userId", String(res.data.userId ?? ""));
      localStorage.setItem("email", email);

      setMessage("Login berhasil. Mengarahkan...");
      setMessageType("success");
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || "Login gagal"
        : "Login gagal";
      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-8 lg:gap-12 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="hidden lg:flex flex-col justify-center text-white space-y-8"
        >
          <div>
            <motion.div
              variants={itemVariants}
              custom={0}
              className="inline-flex items-center gap-2 mb-4"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center">
                <Package size={28} />
              </div>
              <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">JNE Express</span>
            </motion.div>

            <motion.h1 variants={itemVariants} custom={1} className="text-5xl lg:text-6xl font-bold leading-tight">
              Pengiriman <br /> Cepat & <br /> Terpercaya
            </motion.h1>

            <motion.p variants={itemVariants} custom={2} className="text-xl text-slate-400 mt-6 leading-relaxed max-w-lg">
              Solusi logistik terintegrasi dengan teknologi terkini untuk memastikan setiap paket sampai dengan aman dan tepat waktu.
            </motion.p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {[
              { icon: Truck, title: "Tracking Real-time", desc: "Pantau paket Anda setiap saat" },
              { icon: BarChart3, title: "Dashboard Analytics", desc: "Laporan lengkap dan mendetail" },
              { icon: Package, title: "Manajemen Shipment", desc: "Kelola pengiriman dengan mudah" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                custom={3 + i}
                className="flex items-start gap-4 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/20 transition">
                  <feature.icon size={24} className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Auth Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex items-center"
        >
          <div className="w-full bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
            {/* Logo Mobile */}
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                <Package size={24} className="text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900">JNE Express</span>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                {isLogin ? "Selamat Datang Kembali" : "Buat Akun Baru"}
              </h2>
              <p className="text-slate-600">
                {isLogin
                  ? "Masuk ke akun Anda untuk mengakses dashboard"
                  : "Bergabunglah dengan ribuan pengguna JNE Express"}
              </p>
            </div>

            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg mb-6 flex items-start gap-3 ${
                  messageType === "success"
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    messageType === "success" ? "bg-green-200" : "bg-red-200"
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${
                      messageType === "success" ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {messageType === "success" ? "✓" : "!"}
                  </span>
                </div>
                <p
                  className={messageType === "success" ? "text-green-700" : "text-red-700"}
                >
                  {message}
                </p>
              </motion.div>
            )}

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                isLogin ? handleLogin() : handleRegister();
              }}
              className="space-y-5"
            >
              {!isLogin && (
                <>
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                      <input
                        type="text"
                        placeholder="Masukkan nama lengkap"
                        className="form-input pl-10 w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Role Field */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Peran
                    </label>
                    <select
                      className="form-select w-full"
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

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="email"
                    placeholder="nama@example.com"
                    className="form-input pl-10 w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-slate-400 disabled:to-slate-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isLogin ? "Memproses..." : "Mendaftar..."}</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? "Masuk Sekarang" : "Buat Akun"}</span>
                    <ChevronRight size={20} />
                  </>
                )}
              </motion.button>

              {/* Toggle Auth Mode */}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage("");
                }}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              >
                {isLogin
                  ? "Belum punya akun? Daftar sekarang"
                  : "Sudah punya akun? Masuk di sini"}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-xs text-slate-500 mt-8">
              Dengan masuk, Anda setuju dengan{" "}
              <button className="text-red-600 hover:underline font-semibold">
                Ketentuan Layanan
              </button>{" "}
              dan{" "}
              <button className="text-red-600 hover:underline font-semibold">
                Kebijakan Privasi
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
