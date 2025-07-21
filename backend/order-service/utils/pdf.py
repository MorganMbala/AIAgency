from fpdf import FPDF
import os

def generate_invoice_pdf(order, cart_items, user_name=None):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    # Header
    pdf.set_font("Arial", 'B', 22)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(0, 15, "Invoice", ln=True, align="L")
    # Nom d'utilisateur juste en dessous du titre
    pdf.set_font("Arial", 'B', 14)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(0, 10, f"{user_name if user_name else order.user_id}", ln=True, align="L")
    pdf.set_font("Arial", 'B', 18)
    pdf.set_text_color(120, 120, 120)
    pdf.cell(0, 10, "E-WebGo", ln=True, align="R")
    pdf.set_font("Arial", '', 12)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 8, f"Invoice number     EXAMPLE-{order.id:04d}", ln=True)
    pdf.cell(0, 8, f"Date of issue      {order.date.strftime('%B %d, %Y') if hasattr(order, 'date') else ''}", ln=True)
    pdf.cell(0, 8, f"Date due           {order.due_date.strftime('%B %d, %Y') if hasattr(order, 'due_date') else ''}", ln=True)
    pdf.ln(2)
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(0, 8, f"Bill to", ln=False)
    pdf.set_font("Arial", '', 12)
    pdf.cell(0, 8, f"    {user_name if user_name else order.user_id}", ln=True)
    pdf.ln(2)
    pdf.set_font("Arial", 'B', 16)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(0, 12, f"C${order.total:.2f} due {order.due_date.strftime('%B %d, %Y') if hasattr(order, 'due_date') else ''}", ln=True)
    pdf.ln(4)
    # Table header
    pdf.set_font("Arial", 'B', 12)
    pdf.set_fill_color(240, 240, 240)
    pdf.cell(80, 10, "Description", border=1, fill=True)
    pdf.cell(25, 10, "Qty", border=1, align="C", fill=True)
    pdf.cell(35, 10, "Unit price", border=1, align="R", fill=True)
    pdf.cell(35, 10, "Amount", border=1, align="R", fill=True)
    pdf.ln()
    pdf.set_font("Arial", '', 12)
    # Table rows
    subtotal = 0
    for item in cart_items:
        name = item.get('name', str(item.get('product_id', '')))
        desc = item.get('description', '')
        qty = item.get('quantity', 1)
        price = float(item.get('price', 0))
        amount = qty * price
        subtotal += amount
        description = name + (f" | {desc}" if desc else "")
        pdf.cell(80, 10, description, border=1)
        pdf.cell(25, 10, str(qty), border=1, align="C")
        pdf.cell(35, 10, f"C${price:.2f}", border=1, align="R")
        pdf.cell(35, 10, f"C${amount:.2f}", border=1, align="R")
        pdf.ln()
    # Totals
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(105, 10, "", border=0)
    pdf.cell(35, 10, "Subtotal", border=0, align="R")
    pdf.cell(35, 10, f"C${subtotal:.2f}", border=0, align="R")
    pdf.ln()
    pdf.cell(105, 10, "", border=0)
    pdf.cell(35, 10, "Total", border=0, align="R")
    pdf.cell(35, 10, f"C${order.total:.2f}", border=0, align="R")
    pdf.ln()
    pdf.cell(105, 10, "", border=0)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(35, 10, "Amount due", border=0, align="R")
    pdf.cell(35, 10, f"C${order.total:.2f}", border=0, align="R")
    # Save PDF
    filename = f"invoice_{order.id}.pdf"
    path = os.path.join("static", "invoices", filename)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    pdf.output(path)
    return filename
