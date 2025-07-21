import os
from dotenv import load_dotenv
load_dotenv()
import stripe

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

def create_stripe_payment(amount, currency, user_id):
    intent = stripe.PaymentIntent.create(
        amount=amount,
        currency=currency,
        metadata={"user_id": user_id}
    )
    # Pour test, on simule le paiement réussi
    return {"id": intent.id, "status": "succeeded"}
