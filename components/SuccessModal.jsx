import React from "react";
import { CheckCircle, PartyPopper } from "lucide-react";

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-hidden">
      {/* Ribbon containers */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute -top-10 animate-ribbon opacity-70`}
            style={{
              left: `${i * 5}%`,
              animationDelay: `${i * 0.1}s`,
              backgroundColor: i % 2 === 0 ? "#60A5FA" : "#34D399",
              width: "2px",
              height: "100px",
              transform: `rotate(${Math.random() * 30 - 15}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm w-full mx-4 animate-modalSlideIn overflow-hidden">
        {/* Confetti elements */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-confetti`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 100}px`,
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              backgroundColor: ["#60A5FA", "#34D399", "#FDE047"][
                Math.floor(Math.random() * 3)
              ],
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-3 animate-scaleIn">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-6 left-0 w-full flex justify-between px-4">
          <PartyPopper
            className="text-yellow-500 animate-swingLeft"
            size={32}
          />
          <PartyPopper
            className="text-yellow-500 animate-swingRight"
            size={32}
          />
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-green-600 mb-4 animate-slideUp">
          Order Placed Successfully!
        </h2>

        <div className="space-y-3 animate-slideUp">
          <p className="text-gray-700">
            Your order has been placed successfully. Thank you for shopping with
            us!
          </p>
          <p className="text-sm text-gray-500">
            Order confirmation has been sent to your email
          </p>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="mt-6 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-200 shadow-md animate-slideUp"
        >
          Close
        </button>
      </div>

      <style>{`
        @keyframes fallDown {
          0% {
            transform: translateY(-100vh) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(-100px) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }

        @keyframes modalSlideIn {
          0% {
            transform: translateY(-50px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }

        @keyframes slideUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes swingLeft {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }

        @keyframes swingRight {
          0%, 100% { transform: rotate(10deg); }
          50% { transform: rotate(-10deg); }
        }

        .animate-ribbon {
          animation: fallDown 2s linear forwards;
        }

        .animate-confetti {
          animation: confetti 5s linear infinite;
        }

        .animate-modalSlideIn {
          animation: modalSlideIn 0.5s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }

        .animate-swingLeft {
          animation: swingLeft 2s ease-in-out infinite;
        }

        .animate-swingRight {
          animation: swingRight 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SuccessModal;
