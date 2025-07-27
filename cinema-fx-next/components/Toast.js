import { useEffect, useCallback } from "react";

export default function Toast({ message, show, onClose, type = "success" }) {
  const handleClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(handleClose, 2200);
      return () => clearTimeout(timer);
    }
  }, [show, handleClose]);

  if (!show) return null;

  return (
    <div className={`custom-toast ${type}`} role="alert" aria-live="assertive">
      <span>{message}</span>
      <button
        aria-label="Close"
        onClick={handleClose}
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          marginLeft: 10,
          cursor: "pointer",
          fontSize: "1.2rem",
        }}
      >
        ×
      </button>
      <style jsx>{`
        .custom-toast {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: #fff;
          padding: 0.7rem 1.5rem;
          border-radius: 8px;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
          font-size: 1.05rem;
          z-index: 9999;
          min-width: 240px;
          max-width: 90vw;
          text-align: center;
          animation: fadeIn 0.3s;
          background: ${type === "error" ? "#d32f2f" : "#43a047"};
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        button {
          outline: none;
        }
      `}</style>
    </div>
  );
}
