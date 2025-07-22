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

    # Enrichir les items avec toutes les infos produits si nécessaire
    # Si les items n'ont pas 'name' ou 'description', requête le tech-service
    need_enrich = any('name' not in item or 'description' not in item for item in cart_items)
    if need_enrich:
        import requests
        ids = [item.get("product_id") or item.get("productId") or item.get("_id") or item.get("id") for item in cart_items]
        try:
            resp = requests.post("http://localhost:5002/api/products/bulk", json={"ids": ids})
            products = resp.json()
            # Associe chaque item à ses infos produit
            for item in cart_items:
                pid = item.get("product_id") or item.get("productId") or item.get("_id") or item.get("id")
                prod = next((p for p in products if p.get("_id") == pid or p.get("id") == pid), None)
                if prod:
                    item["name"] = prod.get("name", str(pid))
                    item["description"] = prod.get("description", "")
                    item["price"] = prod.get("price", item.get("price", 0))
        except Exception as e:
            print("Erreur enrichissement produits pour PDF:", e)
    invoice_path = generate_invoice_pdf(order, cart_items, user_name)
    invoice_url = f"/static/invoices/{invoice_path}"

    return {
        "order_id": order.id,
        "status": "validated",
        "invoice_url": invoice_url
    }

@router.post("/create-payment-intent")
async def create_payment_intent(request: Request, token: str = Cookie(None)):
    if not token:
        raise HTTPException(status_code=401, detail="JWT cookie manquant. Veuillez vous connecter.")
    data = await request.json()
    cart_items = data.get("cart_items")
    if not cart_items:
        raise HTTPException(status_code=400, detail="Missing cart items")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("user_id") or payload.get("id") or payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    total = sum(item["price"] * item["quantity"] for item in cart_items)
    payment_intent = create_stripe_payment(amount=int(total * 100), currency="usd", user_id=user_id)
    return {"client_secret": payment_intent["client_secret"], "payment_intent_id": payment_intent["id"]}

@router.post("/confirm")
async def confirm_order(request: Request, db: Session = Depends(get_db), token: str = Cookie(None)):
    if not token:
        raise HTTPException(status_code=401, detail="JWT cookie manquant. Veuillez vous connecter.")
    data = await request.json()
    cart_items = data.get("cart_items")
    payment_intent_id = data.get("payment_intent_id")
    if not cart_items or not payment_intent_id:
        raise HTTPException(status_code=400, detail="Missing data")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("user_id") or payload.get("id") or payload.get("sub")
        user_name = payload.get("username") or payload.get("name") or None
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    # Vérifie le statut du PaymentIntent Stripe
    import stripe
    stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
    intent = stripe.PaymentIntent.retrieve(payment_intent_id)
    if intent.status != "succeeded":
        raise HTTPException(status_code=402, detail="Paiement non validé")
    total = sum(item["price"] * item["quantity"] for item in cart_items)
    order = Order(
        user_id=user_id,
        total=total,
        payment_id=payment_intent_id,
        status="validated"
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    for item in cart_items:
        product_id = item.get("product_id") or item.get("productId") or item.get("_id") or item.get("id")
        db.add(OrderItem(order_id=order.id, product_id=product_id, quantity=item["quantity"], price=item["price"]))
    db.commit()
    # Enrichir les items avec toutes les infos produits si nécessaire
    # Si les items n'ont pas 'name' ou 'description', requête le tech-service
    need_enrich = any('name' not in item or 'description' not in item for item in cart_items)
    if need_enrich:
        import requests
        ids = [item.get("product_id") or item.get("productId") or item.get("_id") or item.get("id") for item in cart_items]
        try:
            resp = requests.post("http://localhost:5002/api/products/bulk", json={"ids": ids})
            products = resp.json()
            # Associe chaque item à ses infos produit
            for item in cart_items:
                pid = item.get("product_id") or item.get("productId") or item.get("_id") or item.get("id")
                prod = next((p for p in products if p.get("_id") == pid or p.get("id") == pid), None)
                if prod:
                    item["name"] = prod.get("name", str(pid))
                    item["description"] = prod.get("description", "")
                    item["price"] = prod.get("price", item.get("price", 0))
        except Exception as e:
            print("Erreur enrichissement produits pour PDF:", e)
    invoice_path = generate_invoice_pdf(order, cart_items, user_name)
    invoice_url = f"/static/invoices/{invoice_path}"
    return {
        "order_id": order.id,
        "status": "validated",
        "invoice_url": invoice_url
    }

@router.get("/history")
async def get_order_history(db: Session = Depends(get_db), token: str = Cookie(None)):
    if not token:
        raise HTTPException(status_code=401, detail="JWT cookie manquant. Veuillez vous connecter.")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("user_id") or payload.get("id") or payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")
    orders = db.query(Order).filter(Order.user_id == user_id).order_by(Order.created_at.desc()).all()
    result = []
    import requests
    TECH_SERVICE_URL = "http://localhost:5002/api/products/bulk"
    for order in orders:
        items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
        product_ids = [item.product_id for item in items]
        # Appel au tech-service pour enrichir les infos produits
        products = []
        if product_ids:
            try:
                resp = requests.post(TECH_SERVICE_URL, json={"ids": product_ids}, timeout=3)
                if resp.status_code == 200:
                    products = resp.json()
            except Exception:
                products = []
        def enrich_item(item):
            prod = next((p for p in products if str(p.get("_id")) == str(item.product_id)), {})
            return {
                "productId": item.product_id,
                "name": getattr(item, 'product_name', prod.get("name", "")),
                "quantity": item.quantity,
                "image": prod.get("image", "")
            }
        result.append({
            "id": order.id,
            "date": order.created_at.strftime('%Y-%m-%d %H:%M'),
            "total": order.total,
            "invoice_url": f"http://localhost:8000/static/invoices/invoice_{order.id}.pdf",
            "items": [enrich_item(item) for item in items]
        })
    return result

ACCOUNT_SERVICE_URL = "http://localhost:5001/api/users/"

def get_username(user_id):
    import requests
    try:
        resp = requests.get(f"{ACCOUNT_SERVICE_URL}{user_id}", timeout=2)
        if resp.status_code == 200:
            data = resp.json()
            # Prend le nom ou le username si disponible
            return data.get("name") or data.get("username") or f"User {user_id}"
    except Exception:
        pass
    return f"User {user_id}"

@router.get("/all")
def get_all_orders(db: Session = Depends(get_db), page: int = 1, limit: int = 20):
    import requests
    TECH_SERVICE_URL = "http://localhost:5002/api/products/bulk"
    offset = (page - 1) * limit
    orders = db.query(Order).order_by(Order.created_at.desc()).offset(offset).limit(limit).all()
    print(f"Commandes récupérées depuis la base : {orders}")
    # Récupérer tous les items en une seule requête
    order_ids = [order.id for order in orders]
    items = db.query(OrderItem).filter(OrderItem.order_id.in_(order_ids)).all()
    # Regrouper les items par commande
    items_by_order = {}
    for item in items:
        items_by_order.setdefault(item.order_id, []).append(item)
    # Récupérer tous les product_ids uniques
    all_product_ids = list(set([item.product_id for item in items]))
    products = []
    if all_product_ids:
        try:
            resp = requests.post(TECH_SERVICE_URL, json={"ids": all_product_ids}, timeout=3)
            if resp.status_code == 200:
                products = resp.json()
        except Exception as e:
            print(f"Erreur enrichissement produits bulk: {e}")
            products = []
    # Indexer les produits par id
    products_by_id = {str(prod.get("_id")): prod for prod in products}
    result = []
    for order in orders:
        try:
            order_items = items_by_order.get(order.id, [])
            def enrich_item(item):
                prod = products_by_id.get(str(item.product_id), {})
                return {
                    "name": prod.get("name", getattr(item, 'product_name', str(item.product_id))),
                    "image": prod.get("image", ""),
                    "quantity": item.quantity
                }
            customer_name = get_username(order.user_id)
            result.append({
                "OrderID": order.id,
                "CustomerName": customer_name,
                "TotalAmount": order.total,
                "OrderItems": ', '.join([enrich_item(item)["name"] for item in order_items]),
                "Status": getattr(order, 'status', ''),
                "StatusBg": "#22C55E" if getattr(order, 'status', '') == "validated" else "#FB9678",
                "ProductImage": order_items and enrich_item(order_items[0])["image"] or "",
            })
        except Exception as e:
            print(f"Erreur lors du mapping de la commande {order.id}: {e}")
    print(f"Résultat envoyé au frontend : {result}")
    return result
