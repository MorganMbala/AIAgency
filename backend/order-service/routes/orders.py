from fastapi import APIRouter, Depends, HTTPException, Request, Cookie
from sqlalchemy.orm import Session
from models import Order, OrderItem
from database import get_db
from utils.stripe import create_stripe_payment
from utils.pdf import generate_invoice_pdf
import jwt
import os

router = APIRouter()

JWT_SECRET = os.getenv("JWT_SECRET", "unePhraseSecreteSuperLongue")

@router.post("/validate")
async def validate_order(request: Request, db: Session = Depends(get_db), token: str = Cookie(None)):
    if not token:
        raise HTTPException(status_code=401, detail="JWT cookie manquant. Veuillez vous connecter.")
    data = await request.json()
    cart_items = data.get("cart_items")
    if not cart_items:
        raise HTTPException(status_code=400, detail="Missing cart items")
    # Récupère l'ID utilisateur depuis le JWT du cookie
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("user_id") or payload.get("id") or payload.get("sub")
        user_name = payload.get("username") or payload.get("name") or None
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")

    total = sum(item["price"] * item["quantity"] for item in cart_items)
    payment_intent = create_stripe_payment(amount=int(total * 100), currency="usd", user_id=user_id)
    if not payment_intent["status"] == "succeeded":
        raise HTTPException(status_code=402, detail="Payment failed")

    order = Order(
        user_id=user_id,
        total=total,
        payment_id=payment_intent["id"],
        status="validated"
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    for item in cart_items:
        db.add(OrderItem(order_id=order.id, product_id=item["product_id"], quantity=item["quantity"], price=item["price"]))
    db.commit()

    # Enrichir les items avec toutes les infos produits
    # Si le frontend envoie déjà name, description, etc. dans cart_items, rien à faire
    # Sinon, il faut requêter le service produits ici pour enrichir
    invoice_path = generate_invoice_pdf(order, cart_items, user_name)
    invoice_url = f"/static/invoices/{invoice_path}"

    return {
        "order_id": order.id,
        "status": "validated",
        "invoice_url": invoice_url
    }
