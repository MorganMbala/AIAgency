import React, { useState } from "react";
import StripeCheckout from "./StripeCheckout";

const OrderPage = ({ cartItems }) => {
  const [showStripe, setShowStripe] = useState(false);

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Récapitulatif de commande</h2>
      {/* Affiche le panier ici si besoin */}
      <ul className="mb-6">
        {cartItems.map((item, idx) => (
          <li key={idx} className="mb-2 flex justify-between">
            <span>{item.name} x{item.quantity}</span>
            <span className="font-bold">C${item.price}</span>
          </li>
        ))}
      </ul>
      {!showStripe ? (
        <button
          className="bg-cyan-600 text-white px-6 py-2 rounded font-bold w-full"
          onClick={() => setShowStripe(true)}
        >
          Checkout
        </button>
      ) : (
        <StripeCheckout cartItems={cartItems} />
      )}
    </div>
  );
};

export default OrderPage;
