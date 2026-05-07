import { CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ToastContainer() {
  const { toasts } = useCart();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium animate-bounce-in"
          style={{ animation: 'slideUp 0.3s ease-out' }}
        >
          <CheckCircle size={18} className="text-teal-400 flex-shrink-0" />
          <span>
            <strong>{toast.name}</strong> sepete eklendi!
          </span>
        </div>
      ))}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
