import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useLocation } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51Rn85aRHL1ISbtvlAMagPPgxIROoDdspalkscV3jTjlyDI9kMChHfBXRBEtsmE0zlgonMHNhl3Zp0EPg5OS45ZUp00Vt8LpO3H"); // Remplace par ta clé publique Stripe

const CheckoutForm = ({ cartItems }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("payment");
  const [invoiceUrl, setInvoiceUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Crée le PaymentIntent côté backend
      const res = await axios.post(
        "http://localhost:8000/api/orders/create-payment-intent",
        { cart_items: cartItems },
        { withCredentials: true }
      );
      const clientSecret = res.data.client_secret;
      const paymentIntentId = res.data.payment_intent_id;

      // 2. Confirme le paiement avec Stripe Elements
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        // 3. Appelle le backend pour enregistrer la commande et générer la facture
        const confirmRes = await axios.post(
          "http://localhost:8000/api/orders/confirm",
          { cart_items: cartItems, payment_intent_id: paymentIntentId },
          { withCredentials: true }
        );
        setInvoiceUrl(confirmRes.data.invoice_url);
        setStep("invoice");
        // 4. Vide le panier côté backend et rafraîchit le contexte global
        await axios.post("http://localhost:5003/api/cart/clear", {}, { withCredentials: true });
        if (window.refreshCart) window.refreshCart(); // ou utilise le contexte Cart si disponible
      } else {
        alert("Paiement échoué !");
      }
    } catch (err) {
      alert("Erreur paiement !");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg text-black">
      {step === "payment" ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Paiement du panier</h2>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="font-semibold mb-1">Votre commande E-WebGo</div>
            <div className="text-cyan-700 font-bold text-lg mb-1">{cartItems.length} produit(s)</div>
            <div className="text-gray-600 text-sm mb-2">Vérifiez vos articles et renseignez vos informations de paiement pour finaliser la commande.</div>
          </div>
          <div className="flex gap-8 justify-center mb-4">
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold mb-1">Carte bancaire</span>
              <span className="text-2xl">💳</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold mb-1">PayPal</span>
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Nom sur la carte</label>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="Jean Dupont" required />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Numéro de carte</label>
            <CardElement options={{ style: { base: { fontSize: "18px" } } }} />
            <div className="flex gap-2 mt-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-6" />
            </div>
          </div>
          <div className="flex items-center mb-2">
            <input type="checkbox" className="mr-2" defaultChecked />
            <span className="text-sm">Sauvegarder mes informations de paiement pour mes prochaines commandes.</span>
          </div>
          <div className="bg-gray-100 rounded p-3 mb-4 text-sm text-gray-600">
            En cliquant sur "Autoriser le paiement", vous validez votre commande E-WebGo. Aucun abonnement, aucun prélèvement récurrent. Vous recevrez une facture PDF après paiement.
          </div>
          <div className="text-xl font-bold text-cyan-700 mb-2">Montant total à payer : $ {cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0).toFixed(2)} </div>
          <button type="submit" disabled={!stripe || loading} className="bg-cyan-600 text-white px-6 py-3 rounded font-bold w-full mt-2 text-lg">
            {loading ? "Paiement..." : "Autoriser le paiement"}
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-6">
            {/* Icône validation verte */}
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="#22C55E"/>
              <path d="M44 24L29 39L20 30" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Thanks for your order</h2>
          <div className="text-gray-600 mb-6">We're almost there !!! </div>
          <div className="bg-gray-50 rounded-lg shadow p-4 w-full max-w-md flex items-center justify-between mb-4 border border-gray-200">
            <span className="font-semibold text-gray-700">Total Amount</span>
            <span className="font-bold text-gray-700">${cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0).toFixed(2)}</span>
          </div>
          <a href={`http://localhost:8000${invoiceUrl}`} target="_blank" rel="noopener noreferrer" className="underline text-cyan-700 font-semibold mt-2">Voir la facture PDF</a>
        </div>
      )}
    </div>
  );
};

const StripeCheckout = () => {
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm cartItems={cartItems} />
    </Elements>
  );
};

export default StripeCheckout;
