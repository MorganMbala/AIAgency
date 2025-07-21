from fpdf import FPDF
import os

def generate_invoice_pdf(order, cart_items, user_name=None):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt=f"Facture - Commande #{order.id}", ln=True, align="C")
    if user_name:
        pdf.cell(200, 10, txt=f"Utilisateur: {user_name}", ln=True)
    else:
        pdf.cell(200, 10, txt=f"Utilisateur: {order.user_id}", ln=True)
    pdf.cell(200, 10, txt=f"Total: ${order.total}", ln=True)
    pdf.cell(200, 10, txt="Produits:", ln=True)
    for item in cart_items:
        line = f"- {item.get('name', item['product_id'])} x{item['quantity']} @ ${item['price']}"
        if item.get('description'):
            line += f" | {item['description']}"
        pdf.cell(200, 10, txt=line, ln=True)
    filename = f"invoice_{order.id}.pdf"
    path = os.path.join("static", "invoices", filename)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    pdf.output(path)
    return filename
