"use client";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-600 border-r-red-600 animate-spin"
          style={{ animation: "spin 1s linear infinite" }}
        ></div>
      </div>
      <p className="mt-4 text-slate-600 font-medium">Memuat data...</p>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card--compact animate-pulse">
          <div className="h-4 bg-slate-200 rounded-full w-3/4 mb-3"></div>
          <div className="h-3 bg-slate-200 rounded-full w-full mb-2"></div>
          <div className="h-3 bg-slate-200 rounded-full w-5/6"></div>
        </div>
      ))}
    </div>
  );
}
