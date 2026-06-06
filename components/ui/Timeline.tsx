"use client";

import { CheckCircle2, Circle, Clock } from "lucide-react";

interface TimelineItem {
  status: string;
  description: string;
  timestamp?: string;
  completed?: boolean;
  current?: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
  showDates?: boolean;
}

export function Timeline({ items, showDates = true }: TimelineProps) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex gap-4">
          {/* Timeline Marker */}
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-4 transition-all ${
                item.completed
                  ? "bg-green-100 border-green-500 text-green-600"
                  : item.current
                    ? "bg-red-100 border-red-500 text-red-600 animate-pulse"
                    : "bg-slate-100 border-slate-300 text-slate-400"
              }`}
            >
              {item.completed ? (
                <CheckCircle2 size={20} />
              ) : item.current ? (
                <Clock size={20} />
              ) : (
                <Circle size={20} />
              )}
            </div>

            {/* Connector Line */}
            {index < items.length - 1 && (
              <div
                className={`w-1 h-12 mt-2 ${
                  item.completed ? "bg-green-300" : "bg-slate-200"
                }`}
              />
            )}
          </div>

          {/* Timeline Content */}
          <div className="flex-1 pt-2 pb-4">
            <h4
              className={`font-semibold ${
                item.completed
                  ? "text-green-700"
                  : item.current
                    ? "text-red-700"
                    : "text-slate-400"
              }`}
            >
              {item.status}
            </h4>
            <p className="text-sm text-slate-600 mt-1">{item.description}</p>
            {showDates && item.timestamp && (
              <p className="text-xs text-slate-500 mt-2">
                {new Date(item.timestamp).toLocaleString("id-ID")}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
