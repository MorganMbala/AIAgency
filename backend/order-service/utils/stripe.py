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
    # Retourne le client_secret pour Stripe Elements
    return {"id": intent.id, "status": intent.status, "client_secret": intent.client_secret}
