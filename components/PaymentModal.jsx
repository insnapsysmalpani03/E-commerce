import React from "react";

const PaymentModal = ({ isOpen, onClose, onConfirm }) => {
  const [paymentMethod, setPaymentMethod] = React.useState("Cash on Delivery");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full mb-4 border rounded p-2"
        >
          <option value="Cash on Delivery">Cash on Delivery</option>
          <option value="Credit Card">Credit Card</option>
          <option value="UPI">UPI</option>
          <option value="Net Banking">Net Banking</option>
        </select>
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-pink-500 text-white px-4 py-2 rounded"
            onClick={() => onConfirm(paymentMethod)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
