import { CheckCircle2, XCircle, Info, X } from "lucide-react";

function StatusBanner({ type = "info", title, message, onClose }) {
  const styles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    error: "border-rose-200 bg-rose-50 text-rose-900",
    info: "border-sky-200 bg-sky-50 text-sky-900",
  };

  const Icon = type === "success" ? CheckCircle2 : type === "error" ? XCircle : Info;

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 shadow-sm ${styles[type] || styles.info}`}
      role="status"
      aria-live="polite"
    >
      <div className="mt-0.5">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        {message ? <p className="text-sm opacity-90 mt-1">{message}</p> : null}
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 hover:bg-black/5 transition"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4" />
        </button>
      ) : null}
    </div>
  );
}

export default StatusBanner;
