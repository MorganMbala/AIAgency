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
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6">Paiement sécurisé</h2>
          <CardElement options={{ style: { base: { fontSize: "18px" } } }} />
          <button type="submit" disabled={!stripe || loading} className="bg-cyan-600 text-white px-6 py-2 rounded font-bold w-full mt-4">
            {loading ? "Paiement..." : "Autoriser le paiement"}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Paiement validé !</h2>
          <a href={`http://localhost:8000${invoiceUrl}`} target="_blank" rel="noopener noreferrer" className="underline text-cyan-700 font-semibold">Voir la facture PDF</a>
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
