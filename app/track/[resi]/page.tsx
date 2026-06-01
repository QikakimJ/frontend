"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

export default function TrackingDetail() {
  const params = useParams();
  const resi = params.resi as string;
  const [shipment, setShipment] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState<any>(null);

  useEffect(() => {
    fetchTrackingData();
  }, [resi]);

  const fetchTrackingData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/Shipment/track/${resi}`);
      setShipment(response.data.shipment);
      setHistory(response.data.history || []);

      // Get QR Code
      const qrResponse = await api.get(`/QrCode/${resi}`);
      setQrData(qrResponse.data);
    } catch (err: any) {
      setError(err.response?.data || "Gagal memuat data tracking");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return "⏳";
      case "Picked":
        return "📦";
      case "On Delivery":
        return "🚚";
      case "Delivered":
        return "✅";
      default:
        return "📍";
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "Pending":
        return 25;
      case "Picked":
        return 50;
      case "On Delivery":
        return 75;
      case "Delivered":
        return 100;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="main-shell page-shell min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🚚</div>
          <p className="text-gray-600">Memuat data tracking...</p>
        </div>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="main-shell page-shell min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg text-center">
          <div className="text-3xl mb-2">❌</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-shell page-shell min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-3xl font-bold mb-1">📍 Tracking Pengiriman</h1>
        <p className="text-red-100">Nomor Resi: {shipment.resi}</p>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Main Shipment Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{shipment.resi}</h2>
              <p className="text-sm text-gray-500">
                Dibuat: {new Date(shipment.createdAt).toLocaleDateString("id-ID")}
              </p>
            </div>
            <button
              onClick={() => setShowQR(!showQR)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
            >
              🔲 {showQR ? "Tutup" : "Tampil"} QR
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Status</span>
              <span className="text-sm font-semibold text-red-600">{getProgressPercentage(shipment.status)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-red-700 transition-all duration-500"
                style={{ width: `${getProgressPercentage(shipment.status)}%` }}
              ></div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="text-center mb-6">
            <div className="inline-block text-5xl mb-2">{getStatusIcon(shipment.status)}</div>
            <p className="text-2xl font-bold text-gray-900">{shipment.status}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-xs text-gray-500 mb-1">DARI</p>
              <p className="font-bold text-gray-900">{shipment.origin}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">KE</p>
              <p className="font-bold text-gray-900">{shipment.destination}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">PENGIRIM</p>
              <p className="font-bold text-gray-900">{shipment.senderName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">PENERIMA</p>
              <p className="font-bold text-gray-900">{shipment.receiverName}</p>
            </div>
          </div>

          {/* Package Info */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Berat Paket:</span>
              <span className="font-semibold text-gray-900">{shipment.weight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Layanan:</span>
              <span className="font-semibold text-gray-900">{shipment.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Biaya:</span>
              <span className="font-bold text-red-600">
                Rp {shipment.shippingCost?.toLocaleString("id-ID") || 0}
              </span>
            </div>
            {shipment.estimatedDelivery && (
              <div className="flex justify-between">
                <span className="text-gray-700">Estimasi Tiba:</span>
                <span className="font-semibold text-gray-900">
                  {new Date(shipment.estimatedDelivery).toLocaleDateString("id-ID")}
                </span>
              </div>
            )}
            {shipment.actualDelivery && (
              <div className="flex justify-between">
                <span className="text-gray-700">Sampai:</span>
                <span className="font-semibold text-green-600">
                  {new Date(shipment.actualDelivery).toLocaleDateString("id-ID")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* QR Code */}
        {showQR && qrData && (
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-bold mb-4">Scan untuk Tracking</h3>
            <img
              src={qrData.qrCodeUrl}
              alt="QR Code"
              className="w-40 h-40 mx-auto border-2 border-gray-200 rounded-lg"
            />
            <p className="text-sm text-gray-500 mt-4">{qrData.resi}</p>
          </div>
        )}

        {/* Timeline History */}
        {history.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-6 text-gray-900">📅 Riwayat Status</h3>
            <div className="space-y-4">
              {history.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                    {index < history.length - 1 && (
                      <div className="w-1 h-12 bg-gray-200 my-1"></div>
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="font-semibold text-gray-900">{item.status}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
