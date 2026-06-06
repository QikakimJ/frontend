"use client";

import { ArrowRight, MapPin, Calendar, Package } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface ShipmentCardProps {
  resi: string;
  senderName?: string;
  receiverName?: string;
  origin?: string;
  destination?: string;
  status?: string;
  date?: string;
  weight?: string;
  onClick?: () => void;
}

export function ShipmentCard({
  resi,
  senderName,
  receiverName,
  origin,
  destination,
  status = "In Transit",
  date,
  weight,
  onClick,
}: ShipmentCardProps) {
  return (
    <div
      onClick={onClick}
      className="group card--compact cursor-pointer hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
            Nomor Resi
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-mono">{resi}</h3>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="space-y-3 mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-sm">
          <Package size={16} className="text-red-600" />
          <div>
            <p className="text-slate-600">{senderName || "Pengirim"}</p>
            <p className="text-xs text-slate-500">Dari</p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <ArrowRight size={16} className="text-slate-400" />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MapPin size={16} className="text-red-600" />
          <div>
            <p className="text-slate-600">{receiverName || "Penerima"}</p>
            <p className="text-xs text-slate-500">Ke</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-slate-500 mb-1">Rute</p>
          <p className="font-medium text-slate-900">
            {origin || "-"} → {destination || "-"}
          </p>
        </div>
        {date && (
          <div>
            <p className="text-slate-500 mb-1">Tanggal</p>
            <p className="font-medium text-slate-900 flex items-center gap-1">
              <Calendar size={14} />
              {new Date(date).toLocaleDateString("id-ID")}
            </p>
          </div>
        )}
      </div>

      {weight && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500 mb-1">Berat</p>
          <p className="font-semibold text-slate-900">{weight} kg</p>
        </div>
      )}
    </div>
  );
}
