import React from "react";
import { useLocation } from "react-router-dom";

// SUPPRESSION DU FORMULAIRE ET DES APPELS DE PAIEMENT
// Ce composant ne doit plus contenir de formulaire ou de logique de paiement
// Utilisez StripeCheckout.jsx pour le paiement sécurisé
export default function Checkout() {
  return (
    <div className="text-center text-gray-500 py-12">
      Paiement désactivé ici. Utilisez la page StripeCheckout pour payer en toute sécurité.
    </div>
  );
}
